const employees = require("../model/employeeModel");
const users = require("../model/userModel");
const jwt = require("jsonwebtoken")

//register

exports.registerController = async (req, res) => {
  console.log("Inside register controller")

  const { username, email, password } = req.body
  console.log(username, email, password)

  try {
    const existingUser = await users.findOne({ email })

    if (existingUser) {
      return res.status(404).json("User already exists... please login")
    }
else{
    const newUser = new users({
      username,
      email,
      password, 
    
    })

    await newUser.save()
    res.status(200).json(newUser)

}
    

  } catch (error) {
    res.status(500).json(error)
  }
}


//login
exports.loginController = async (req, res) => {
    console.log("Inside login controller")

  const {  email, password } = req.body
  console.log( email, password)
  try{
     const existingUser = await users.findOne({ email })

    if (existingUser) {
        if(existingUser.password == password){
            const token = jwt.sign({_id: existingUser._id,
    username: existingUser.username, userMail:existingUser.email, role:existingUser.role  },process.env.JWTSecretKey)
            res.status(200).json({existingUser,token})

           }else{
            res.status(401).json(`Invalid credentials`)

           }
    }else{
        res.status(404).json("user not found... please register")
    }



  }catch(error){
    console.log(error);
    
  }


}

//add  employee

exports.addEmployeeController = async (req, res) => {
  const { name, email, department, designation, joinDate } = req.body;

  try {
    const existingEmployee = await employees.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json("Employee already exists");
    }

    const newEmployee = new employees({
      name,
      email,
      department,
      designation,
      joinDate,
    });

    await newEmployee.save();
    res.status(200).json(newEmployee);
  } catch (err) {
    res.status(500).json(err);
  }
};

//getall employees

exports.getAllEmployeesController = async (req, res) => {
  console.log("Inside get all employees controller");

  try {
    const allEmployees = await employees.find()
    res.status(200).json(allEmployees);
      console.log(allEmployees);
  } catch (err) {
    res.status(500).json(err);
  }
};

//update employee

exports.updateEmployeeController = async (req, res) => {
  const { id } = req.params;
  const { name,email, department, designation, joinDate } = req.body;

  try {
    const updatedEmployee = await employees.findByIdAndUpdate(
      id,
      {
        name,
        email,
        department,
        designation,
        joinDate,
      },
      { new: true }
    );

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json(error);
  }
};

//delete

exports.deleteEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;

    await employees.findByIdAndDelete(id);

    res.status(200).json("Employee deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};


//.......................USERS.................................................................//
// controllers/userController.js
exports.updateUserProfileController = async (req, res) => {
  console.log("inside profile controller");

  const email = req.payload; // from JWT middleware

  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Update profile image
    existingUser.profile = `/Imguploads/${req.file.filename}`;
    await existingUser.save();

    res.status(200).json(existingUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// exports.updateUserProfileController = async (req, res) => {
//   console.log("inside the profile controller");

//   const { username, password, bio, role, profile } = req.body;
//   const email = req.payload; // from JWT middleware

//   // if image uploaded take new image else keep old image
//   const uploadProfile = req.file
//     ? `/Imguploads/${req.file.filename}`
//     : profile;

//   try {
//     const updatedUser = await users.findOneAndUpdate(
//       { email },
//       {
//         username,
//         password,
//         bio,
//         role,
//         profile: uploadProfile,
//       },
//       { new: true }
//     );

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     res.status(500).json(error.message);
//   }
// };