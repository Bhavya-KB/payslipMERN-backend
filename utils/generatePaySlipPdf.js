

const PDFDocument = require("pdfkit");

const generatePayslipPDF = (salary) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    doc.fontSize(20).text(`Payslip for ${salary.month}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Employee Name: ${salary.employeeName}`);
    doc.text(`Department: ${salary.department}`);
    doc.text(`Designation: ${salary.designation}`);
    doc.text(`Total Earnings: ${salary.totalEarnings}`);
    doc.text(`Total Deductions: ${salary.totalDeductions}`);
    doc.text(`Net Salary: ${salary.netSalary}`);
    doc.end();
  });
};

module.exports = generatePayslipPDF;

//old
// const PDFDocument = require("pdfkit");

// const generatePayslipPDF = (salary, res) => {
//   const doc = new PDFDocument({ margin: 50 });

//   doc.pipe(res);

//   // Title
//   doc.fontSize(22).text("PAYSLIP", { align: "center" });
//   doc.moveDown(2);

//   // Employee Info
//   doc.fontSize(12);
//   doc.text(`Employee Name : ${salary.employeeName}`);
//   doc.text(`Designation   : ${salary.designation}`);
//   doc.text(`Department    : ${salary.department}`);
//   doc.text(`Month         : ${salary.month}`);

//   doc.moveDown();

//   // Earnings
//   doc.fontSize(14).text("Earnings", { underline: true });
//   doc.fontSize(12);
//   doc.text(`Basic Salary      : ₹${salary.earnings.basic}`);
//   doc.text(`HRA               : ₹${salary.earnings.hra}`);
//   doc.text(`Conveyance        : ₹${salary.earnings.conveyance}`);
//   doc.text(`Medical Allowance : ₹${salary.earnings.medical}`);
//   doc.text(`Special Allowance : ₹${salary.earnings.special}`);
//   doc.text(`Other Earnings    : ₹${salary.earnings.other}`);

//   doc.moveDown();

//   // Deductions
//   doc.fontSize(14).text("Deductions", { underline: true });
//   doc.fontSize(12);
//   doc.text(`PF                : ₹${salary.deductions.pf}`);
//   doc.text(`Professional Tax  : ₹${salary.deductions.professionalTax}`);
//   doc.text(`TDS               : ₹${salary.deductions.tds}`);
//   doc.text(`Insurance         : ₹${salary.deductions.insurance}`);
//   doc.text(`Loss Of Pay       : ₹${salary.deductions.lossOfPay}`);

//   doc.moveDown();

//   // Totals
//   doc.fontSize(13).text(`Total Earnings   : ₹${salary.totalEarnings}`);
//   doc.text(`Total Deductions : ₹${salary.totalDeductions}`);

//   doc.moveDown();
//   doc.fontSize(16).text(`Net Salary : ₹${salary.netSalary}`, {
//     align: "right",
//   });

//   doc.end();
// };

// module.exports = generatePayslipPDF;
