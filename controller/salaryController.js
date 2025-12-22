const salarys = require("../model/salaryModel");
const generatePayslipPDF = require("../utils/generatePaySlipPdf");

const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const employees = require("../model/employeeModel");

//save salary
exports.createSalary = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const {
      employeeName,
      designation,
      department,
      month,

      earnings,
      deductions,
      totalEarnings,
      totalDeductions,
      netSalary,
    } = req.body;
    // 👇 FETCH EMPLOYEE TO GET THEIR EMAIL
    const employee = await employees.findOne({ name: employeeName });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found in records" });
    }

    const salary = new salarys({
      employeeName,
      designation,
      department,
      month,
      earnings,
      deductions,
      totalEarnings,
      totalDeductions,
      netSalary,
      employeeEmail: employee.email,
      status: "Generated" 
    });

    await salary.save();

    res.status(200).json({
      message: "Salary saved successfully",
      salary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


//generate pdf
exports.generatePayslipController = async (req, res) => {
  try {
    const { employeeName, month } = req.query;

    // Find salary record
    const salary = await salarys.findOne({ employeeName, month });
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    // // Ensure employeeEmail exists
    // if (!salary.employeeEmail) {
    //   console.warn("No employee email found. Skipping email send.");
    // }

    // 1️⃣ Generate PDF buffer
    const pdfBuffer = await generatePayslipPDF(salary);

    // 2️⃣ Create Nodemailer transporter with Brevo (recommended)
    const transporter = nodemailer.createTransport({
   
      service: "gmail",
      secure: false, 
      
      auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 3️⃣ Verify SMTP connection (highly recommended)
    try {
      await transporter.verify();
      console.log("Brevo SMTP connection successful ✅");
    } catch (verifyError) {
      console.error("SMTP connection failed:", verifyError);
      // Continue anyway (PDF can still be downloaded)
    }

    // 4️⃣ Send email with PDF attachment (only if email exists)
    if (salary.employeeEmail) {
      const mailOptions = {
        from: `"Your Company Name" <${ process.env.EMAIL_USER}>`,
        to: salary.employeeEmail,
        subject: `Payslip for ${month}`,
        text: `Dear ${employeeName},\n\nPlease find attached your payslip for ${month}.\n\nBest Regards,\nYour Company Name`,
        html: `
          <h3>Dear ${employeeName},</h3>
          <p>Please find your payslip for <strong>${month}</strong> attached.</p>
          <p>Best Regards,<br/>Your Company Name</p>
        `,
        attachments: [
          {
            filename: `${employeeName}_${month}_Payslip.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully ✅", info.response);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't block PDF response if email fails
      }
    }

    // 5️⃣ Send PDF to frontend (download)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${employeeName}_${month}_Payslip.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//latest

// exports.generatePayslipController = async (req, res) => {
//   try {
//     const { employeeName, month } = req.query;

//     const salary = await salarys.findOne({ employeeName, month });
//     if (!salary) {
//       return res.status(404).json("Salary record not found");
//     }

//     // 1️⃣ Generate PDF buffer
//     const pdfBuffer = await generatePayslipPDF(salary); // modify your generatePayslipPDF to return buffer

//     // 2️⃣ Save temporary PDF (optional)
//     const tempFilePath = path.join(__dirname, `${employeeName}_${month}_Payslip.pdf`);
//     fs.writeFileSync(tempFilePath, pdfBuffer);

//     // 3️⃣ Send email using Nodemailer
//     const transporter = nodemailer.createTransport({
//     //   host: "smtp.gmail.com", // e.g., smtp.gmail.com
//     //   port: 587,
//     host: 'smtp-relay.brevo.com',
//     port: 587,
   
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"Company Name" <${process.env.EMAIL_USER}>`,
//       to: salary.employeeEmail, // make sure employeeEmail is saved in your salary or employee model
//       subject: `Payslip for ${month}`,
//       text: `Dear ${employeeName},\n\nPlease find attached your payslip for ${month}.\n\nBest Regards,\nCompany Name`,
//       attachments: [
//         {
//           filename: `${employeeName}_${month}_Payslip.pdf`,
//           content: pdfBuffer,
//         },
//       ],
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully ✅");

//     // 4️⃣ Send PDF to frontend
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${employeeName}_${month}_Payslip.pdf`
//     );
//     res.send(pdfBuffer);

//     // 5️⃣ Delete temporary file (optional)
//     fs.unlinkSync(tempFilePath);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error);
//   }
// };

// exports.generatePayslipController = async (req, res) => {
//   try {
//     const { employeeName, month } = req.query;

//     const salary = await salarys.findOne({ employeeName, month });

//     if (!salary) {
//       return res.status(404).json("Salary record not found");
//     }

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${employeeName}_${month}_Payslip.pdf`
//     );

//     generatePayslipPDF(salary, res);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };


//....................................employees.......................................................


exports.getPayslipHistory = async (req, res) => {
  try {
    const username = req.user.username;

    const salaries = await salarys
      .find({ employeeName: username })
      .sort({ month: -1 });

    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json(error);
  }
};

/* ================= VIEW ================= */
exports.getPayslipById = async (req, res) => {
  try {
    const salary = await salarys.findById(req.params.id);

    if (!salary) return res.status(404).json("Payslip not found");

    if (salary.employeeName !== req.user.username)
      return res.status(403).json("Unauthorized");

    res.status(200).json(salary);
  } catch (error) {
    res.status(500).json(error);
  }
};

/* ================= DOWNLOAD ================= */
exports.downloadPayslipById = async (req, res) => {
  try {
    const salary = await salarys.findById(req.params.id);

    if (!salary) return res.status(404).json("Payslip not found");

    if (salary.employeeName !== req.user.username)
      return res.status(403).json("Unauthorized");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${salary.employeeName}_${salary.month}_Payslip.pdf`
    );

    generatePayslipPDF(salary, res);
  } catch (error) {
    res.status(500).json(error);
  }
};

//getspaysliphistory

// exports.getPayslipHistory = async (req, res) => {
//   try {

//     const { employeeName } = req.params;

//     const salaries = await salarys
//       .find({ employeeName })
//       .sort({ month: -1 });

//     res.status(200).json(salaries);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error);
//   }
// };

// //getpayslipbyid(view)
// exports.getPayslipById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const salary = await salarys.findById(id);
//     if (!salary) {
//       return res.status(404).json("Payslip not found");
//     }

//     res.status(200).json(salary);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error);
//   }
// };

// //download pdf for employees

// exports.downloadPayslipById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const salary = await salarys.findById(id);
//     if (!salary) {
//       return res.status(404).json("Payslip not found");
//     }

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${salary.employeeName}_${salary.month}_Payslip.pdf`
//     );

//     generatePayslipPDF(salary, res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error);
//   }
// };

//....................................admin dasbaord...............


// Get all salaries
exports.getAllSalaries = async (req, res) => {
  try {
    const salaries = await salarys.find({}).sort({ month: -1 }); // sort by month descending
    res.status(200).json(salaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};