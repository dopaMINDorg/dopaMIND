import nodemailer from "nodemailer";


function createTransporter() {

  return nodemailer.createTransport({

    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },

    logger: true,
    debug: true,

    tls: {
      rejectUnauthorized: false,
    },

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



  } catch(error){


    console.error(
      "EMAIL ERROR:",
      error
    );


    transporter.close();


    throw error;

  }

}