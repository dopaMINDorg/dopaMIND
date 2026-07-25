function createTransporter() {

  return nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },


    tls: {
      rejectUnauthorized: false,
    },


    connectionTimeout: 30000,

    greetingTimeout: 30000,

    socketTimeout: 30000,

  });

}