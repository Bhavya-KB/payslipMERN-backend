const mongoose = require("mongoose")

const employeeSchema = new mongoose.Schema({

    name:{
        type: String,
        required :true
    },

 email:{
        type: String,
        required :true
    },

    department : {
        type : String,
        required : true
    },

     designation: {
        type : String,
        required : true
    },

     joinDate : {
        type : Date,
        required : true
    },

   


   


})

const employees = mongoose.model("employees",employeeSchema)  
module.exports = employees