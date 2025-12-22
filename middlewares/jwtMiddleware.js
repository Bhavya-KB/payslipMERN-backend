const jwt = require("jsonwebtoken")

const jwtMiddleware=(req ,res , next)=>{
    console.log("inside JWT middleware");
    const token = req.headers.authorization.split(" ")[1]
    console.log(token);

    try{

        const jwtResponse = jwt.verify(token,process.env.JWTSecretKey)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail

          // ✅ attach full payload
    req.user = jwtResponse;
       
        next()
        

    }catch(err){
        res.status(401).json("Invalid Token", err)

    }
}

module.exports = jwtMiddleware