const multer = require("multer")

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./Imguploads")
    },
    filename:(req,file,cb)=>{
        cb(null,`Image - ${Date.now()}- ${file.originalname}`)
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype== `image/jpg` || file.mimetype== `image/jpeg` || file.mimetype`image/png`){
        cb(null,true)
    }else{
        cb(null,false)
        return cb(new Error("Accept only png,jpg,jpeg files"))
    }
}

const multerConfig = multer({
    storage,
    fileFilter
})

module.exports = multerConfig