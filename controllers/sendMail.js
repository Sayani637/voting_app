const nodemailer = require('nodemailer')

const sendMail = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount()
  // connect with smtp server
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'turner.feest@ethereal.email',
      pass: 'nn1KvZ8ZdGTr7SkM2C'
    }
  });

  const info = await transporter.sendMail({
    from: '"Sayani Paul 👻" <sayani@gmail.com>', // sender address
    to: "paulsayani304@gmail.com", // list of receivers
    subject: "Hello Sayani✔", // Subject line
    text: "Hello Sayani", // plain text body
    html: "<b>Hello Sayani</b>", // html body
  });
  console.log("Message sent: %s", info.messageId);
  res.json('info');
}

module.exports = sendMail
