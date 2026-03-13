import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = env.MAIL_ENABLED
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    })
  : null;

if (transporter) {
  transporter.verify((error, success) => {
    if (error) {
      console.error("Échec connexion SMTP :", error);
    } else {
      console.log("Connexion SMTP réussie :", success);
    }
  });
}

// Service pour envoi des emails
export const MailService = {
  async sendVerificationEmail(email, token) {
    const link = `${env.CLIENT_URL}/api/auth/verify/${token}`;

    if (!env.MAIL_ENABLED) {
      console.log(`Email désactivé en local. Lien de vérification pour ${email}: ${link}`);
      return;
    }

    try {
      await transporter.sendMail({
        from: `"CAMYS" <${env.SMTP_SENDER}>`, // Nom et email de l’expéditeur
        to: email,
        subject: "Email de vérification",
        html: `<h1>Bienvenue sur notre application</h1>
               <p>Veuillez cliquer sur le lien suivant pour vérifier votre email :</p>
               <a href="${link}" target="_blank" target="_blank">${link}</a>`,
      });
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'email :", err.message);
      throw new Error("Impossible d'envoyer l'email de vérification");
    }
  },
};