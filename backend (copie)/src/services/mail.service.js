import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Echec à la connexion au service SMTP", error);
  } else {
    console.log("Connexion SMTP réussie :", success);
  }
});


export const MailService = {
    async sendVerificationEmail(email, token) {
        const link = `${env.CLIENT_URL}/verify/${token}`;
        await transporter.sendMail({
            from: `"CAMYS" <${env.SMTP_SENDER}>`,
            to: email,
            subject: "Email de vérification",
            html: `<h1>Bienvenue sur notre application </h1> : <p>Veuillez cliquer sur le  <a href="${link}" target="blank">${link}</a> suivant pour vérifier votre mail </p>`
        })
    }
}