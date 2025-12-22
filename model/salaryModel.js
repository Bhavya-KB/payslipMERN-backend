const mongoose = require("mongoose")

const salarySchema = new mongoose.Schema({
   
  employeeName: String,
  designation: String,
  department: String,
  month: String,
  // ADD THIS FIELD
  employeeEmail: {
    type: String,
   
  },

  earnings: {
    basic: Number,
    hra: Number,
    conveyance: Number,
    medical: Number,
    special: Number,
    other: Number,
  },

  deductions: {
    pf: Number,
    professionalTax: Number,
    tds: Number,
    insurance: Number,
    lossOfPay: Number,
  },

  totalEarnings: Number,
  totalDeductions: Number,
  netSalary: Number,

  status: { type: String, default: "Generated" } ,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//     employeeId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "employees",
//     required: true
//   },

//   month: String,
//   year: Number,

//   earnings: {
//     basic: Number,
//     hra: Number,
//     conveyance: Number,
//     medical: Number,
//     special: Number,
//     other: Number
//   },

//   deductions: {
//     pf: Number,
//     tax: Number,
//     insurance: Number,
//     lop: Number
//   },

//   totalEarnings: Number,
//   totalDeductions: Number,
//   netSalary: Number,

//   leavesAllowed: Number,
//   leavesTaken: Number,

//   createdAt: {
//     type: Date,
//     default: Date.now
//   }



   



const salarys = mongoose.model("salarys",salarySchema)  
module.exports = salarys