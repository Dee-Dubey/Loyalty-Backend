const { sendEmail } = require("./app/utilities/utilities");

sendEmail('vijay.ydb@gmail.com', 'Email Test', 'this is just for testing purpose', '<h1>test</h1>').then(() => {
  console.log('Email sent successfully.....');
}).catch((error) => {
  console.error('Error sending email:', error);
});