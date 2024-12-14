require('dotenv').config();
const nodemailer = require("nodemailer");

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

module.exports = {sendEmail}