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

    port: 587,

    secure: false,

    family: 4,


    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },


    connectionTimeout: 10000,

    greetingTimeout: 10000,

    socketTimeout: 10000,

  });

}



function timeoutPromise(promise, ms) {

  return Promise.race([

    promise,

    new Promise((_, reject) => {

      setTimeout(() => {

        reject(
          new Error(
            "Email sending timed out"
          )
        );

      }, ms);

    }),

  ]);

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


  const transporter = createTransporter();



  try {

    console.log(
      "SMTP sending started:",
      to
    );


    const info = await timeoutPromise(

      transporter.sendMail({

        from:
          `"DopaMIND" <${process.env.EMAIL_USER}>`,

        to,

        subject,

        text,

      }),

      20000

    );


    console.log(
      "EMAIL SENT:",
      info.messageId
    );


    await transporter.close();


    return info;


  } catch(error) {


    console.error(
      "EMAIL FAILED:",
      error.message
    );


    try {
      transporter.close();
    } catch {}



    throw error;

  }

}