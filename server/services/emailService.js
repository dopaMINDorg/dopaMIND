import nodemailer from "nodemailer";
import dns from "dns";


console.log(
  "EMAIL_USER:",
  process.env.EMAIL_USER
);

console.log(
  "APP PASSWORD LENGTH:",
  process.env.EMAIL_APP_PASSWORD?.length
);


// Force IPv4 DNS lookup
dns.setDefaultResultOrder("ipv4first");



function createTransporter() {

  return nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,


    auth: {

      user: process.env.EMAIL_USER,

      pass: process.env.EMAIL_APP_PASSWORD,

    },


    logger: true,

    debug: true,


    connectionTimeout: 30000,

    greetingTimeout: 30000,

    socketTimeout: 30000,


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
      "Sending email to:",
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