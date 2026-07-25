import nodemailer from "nodemailer";


console.log(
  "EMAIL_USER:",
  process.env.EMAIL_USER
);

console.log(
  "APP PASSWORD LENGTH:",
  process.env.EMAIL_APP_PASSWORD?.length
);



function createTransporter() {

  return nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {

      user: process.env.EMAIL_USER,

      pass: process.env.EMAIL_APP_PASSWORD,

    },


    logger: true,

    debug: true,


    connectionTimeout: 15000,

    greetingTimeout: 15000,

    socketTimeout: 15000,


  });

}





export async function sendEmail(
  to,
  subject,
  text
) {


  console.log(
    "Preparing email:",
    to
  );



  const transporter =
    createTransporter();



  try {


    console.log(
      "Checking SMTP connection..."
    );


    // Test SMTP connection
    await transporter.verify();



    console.log(
      "SMTP connection successful"
    );



    console.log(
      "Sending email now..."
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



    transporter.close();



    return info;



  } catch(error) {


    console.error(
      "EMAIL FAILED:",
      error
    );



    try {

      transporter.close();

    } catch {}



    throw error;

  }

}