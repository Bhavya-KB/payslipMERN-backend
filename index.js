
//7. import dotenv

require("dotenv").config() 

//1. import express

const express = require("express")

//5. import cors

const cors = require("cors")

//8. import routes
const router = require("./router")

//11. import connection file

require("./db/connection")

//2. create server

const paySlipgeneratorServer = express()

//6. tell server to use the cors

paySlipgeneratorServer.use(cors())

//10. parse request 
paySlipgeneratorServer.use(express.json())

//9. tell server to use router
paySlipgeneratorServer.use(router) 



//3. create port

const PORT = 3000

//4. tell server to listen

paySlipgeneratorServer.listen(PORT,()=>{
    console.log(`payslip server started running successfully at port number ${PORT} ,waiting for client request`);
    
})

paySlipgeneratorServer.get("/",(req,res)=>{
    res.status(200).send(`payslip server started running successfully and waiting for client request`)
})


