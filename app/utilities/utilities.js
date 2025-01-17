require('dotenv').config();
const nodemailer = require("nodemailer");
const XLSX = require('xlsx');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

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

const sendEmail = async(emailTo, subject, text, htmlContent, pdf) =>{
    try{
        const ts = Date.now();
        if(pdf){
          const imageBuffer = Buffer.from(pdf, 'base64');
          const doc = new PDFDocument();
          doc.pipe(fs.createWriteStream(`pdf/${ts}.pdf`));
          doc.image(imageBuffer, {
            fit: [600, 300],
            align: 'center',
            valign: 'center',
          });
          doc.end();
        }
        const mailOptions = {
            from: '"Passme Points" <info@buypassme.com>', // sender address
            to: emailTo,
            subject: subject,
            text: text,
            html: htmlContent
        }
        if(pdf){
          mailOptions.attachments =  [
            {
              filename: 'Qr.pdf',
              path: `./pdf/${ts}.pdf`
            }
          ]
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
      const data = result.map(ele => {
        if(ele !== null && typeof ele === 'object' && !Array.isArray(ele)){
          return ele;
        }
        return ele.toJSON();
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'clients');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.end(excelBuffer);
  }catch(e){
      return res.status(500).json({returnCode:1, msg: 'Something went wrong!Please try after sometime'});
  }
}


module.exports = {sendEmail, downloadExcel}