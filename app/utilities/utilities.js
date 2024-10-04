require('dotenv').config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "vijay.ydb@gmail.com",
    pass: "kbuqtxnsjxpdnuru",
  },
});

const sendEmail = async(emailTo, subject, text, htmlContent) =>{
    try{
        const mailOptions = {
            from: '"Loyality Program" <maddison53@ethereal.email>', // sender address
            to: emailTo, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: htmlContent, // html body
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    }catch(e){
        console.log(e);
    }
}

module.exports = {sendEmail}