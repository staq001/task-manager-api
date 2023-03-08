const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// letting the sendgrid module know we wanna work with this API key.
// const msg = {
//   to: "andrew@mead.io",
//   from: "staq001@aol.com",
//   subject: "This is my first creation!",
//   text: "Text me now brodie. Thanks"
// }

// sgMail.send(msg).then(() => {
//   console.log('Email sent!')
// }).catch((error) => {
//   console.log(error)
// })

// // // helps us send individual mails-- collects two objects.


const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'staq001@aol.com',
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`,
    // html: ""
    // we can cretae a html template and design it however we waant to with the necessary html tools.
  })
}

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "staq001@aol.com",
    subject: "We are sorry to lose you!",
    text: `Goodbye, ${name}. We are so unpleased to lose you. Could we have done something to keep you on board ?`
  })
}
module.exports = {
  sendWelcomeEmail, sendCancelEmail
}
// exporting multiple objects from this file hence the curly braces