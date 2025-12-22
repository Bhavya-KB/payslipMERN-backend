const express = require("express")
const { registerController, loginController, addEmployeeController, getAllEmployeesController, updateEmployeeController, deleteEmployeeController } = require("./controller/userController")
const jwtMiddleware = require("./middlewares/jwtMiddleware")
const employees = require("./model/employeeModel")
const { createSalary, generatePayslipController, getPayslipHistory, downloadPayslipById, getPayslipById, getAllSalaries } = require("./controller/salaryController")

const router = express.Router()

//register
router.post("/register",registerController)

//login
router.post("/login",loginController)

//add employee

router.post("/add-employee",jwtMiddleware, addEmployeeController);

//getallemployees
router.get("/getall-employee",jwtMiddleware, getAllEmployeesController);

//update

router.put("/update-employee/:id",jwtMiddleware, updateEmployeeController);

// delete employees

router.delete( "/delete-employee/:id", jwtMiddleware,deleteEmployeeController);

//..............................................SALARY...........................................................
//save  salary
router.post( "/add-salary",jwtMiddleware, createSalary);

//generate pdf

router.get("/generate-payslip",jwtMiddleware, generatePayslipController);

//.............................employees................................................................

router.get("/payslip-history", jwtMiddleware, getPayslipHistory);
router.get("/payslip/:id", jwtMiddleware, getPayslipById);
router.get("/payslip/download/:id", jwtMiddleware, downloadPayslipById);

//paysliphistory
//  router.get("/history/:employeeName",jwtMiddleware,getPayslipHistory);



// router.get(
//   "/singlepayslip/:id",
//   jwtMiddleware,
//  getPayslipById
// );

// router.get(
//   "/download/:id",
//   jwtMiddleware,
//   downloadPayslipById
// );





//........................admin dasboard......................................

router.get("/all-salaries", jwtMiddleware, getAllSalaries);








module.exports = router