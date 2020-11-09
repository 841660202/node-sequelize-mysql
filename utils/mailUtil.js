const nodemailer = require("nodemailer");
const mailConfig = require("../config/mail.json")
const smtpTransport = nodemailer.createTransport(mailConfig);

const mail = {
  sendHtml: async (data,html) => {
    let info = await smtpTransport.sendMail({
      from: "chenhailong2018@163.com",//发件人邮箱
      to: data.to,//收件人邮箱，多个邮箱地址间用','隔开
      subject: data.subject,//邮件主题
      text: data.text,//text和html两者只支持一种
      html
    })

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return info
  },
  send: async (data) => {
    let info = await smtpTransport.sendMail({
      from: "chenhailong2018@163.com",//发件人邮箱
      to: data.to,//收件人邮箱，多个邮箱地址间用','隔开
      subject: data.subject,//邮件主题
      text: data.text,//text和html两者只支持一种
      // html: require('./index.html')
    })

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return info
  }

}
module.exports = mail