require('dotenv').config();
const nodemailer = require("nodemailer");
const XLSX = require('xlsx');

const transporter = nodemailer.createTransport({
  service: 'Hostinger',
  host: "smtp.hostinger.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "info@buypassme.com",
    pass: "Info@buypassme2021"
  },
});

const sendEmail = async(emailTo, subject, text, htmlContent) =>{
    try{
        const mailOptions = {
            from: '"Passme Points" <info@buypassme.com>', // sender address
            to: emailTo, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: htmlContent, // html body
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    }catch(e){
      console.log(e);
        console.log("error in sending email...");
    }
}

const downloadExcel = async (result, res, filename) =>{
  try{
      const data = result.map(ele => ele.toJSON());
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'clients');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.end(excelBuffer);
  }catch(e){
    console.log(e);
      return res.status(500).json({returnCode:1, msg: 'Something went wrong!Please try after sometime'});
  }
}

module.exports = {sendEmail, downloadExcel}