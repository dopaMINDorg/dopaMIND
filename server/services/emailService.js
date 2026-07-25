import nodemailer from "nodemailer";


console.log(
  "EMAIL_USER:",
  process.env.EMAIL_USER
);


console.log(
  "APP PASSWORD LENGTH:",
  process.env.EMAIL_APP_PASSWORD?.length
);



const transporter =
  nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    family: 4,


    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_APP_PASSWORD,

    },


    connectionTimeout: 10000,

    greetingTimeout: 10000,

    socketTimeout: 10000,

});



// Test SMTP connection when server starts

transporter.verify((error, success) => {

  if (error) {

    console.error(
      "SMTP VERIFY FAILED:",
      error
    );

  } else {

    console.log(
      "SMTP READY"
    );

  }

});





export async function sendEmail(
  to,
  subject,
  text
) {


  console.log(
    "Preparing email:",
    to
  );


  try {


    console.log(
      "SMTP sending started:",
      to
    );


    const info =
      await transporter.sendMail({

        from:
          `"DopaMIND" <${process.env.EMAIL_USER}>`,

        to,

        subject,

        text,

      });



    console.log(
      "EMAIL SENT:",
      info.messageId
    );



    return info;



  } catch(error) {


    console.error(
      "EMAIL FAILED:",
      error
    );


    throw error;

  }


}