// env.js
import "dotenv/config";

/**
 * Choix du provider SMTP
 */
const provider = process.env.MAIL_PROVIDER;
const mailEnabled = process.env.MAIL_ENABLED === "true";

// Vérification minimale des variables critiques
const requiredVars = [
  "DB_HOST",
  "DB_USER",
  "DB_NAME",
  "JWT_SECRET",
  "CLIENT_URL",
];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// Configuration centralisée
export const env = {
  PORT: Number(process.env.PORT) || 5000,

  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS ?? "",
  DB_NAME: process.env.DB_NAME,
  DB_SSL: process.env.DB_SSL === "true",

  JWT_SECRET: process.env.JWT_SECRET,
  MAIL_ENABLED: mailEnabled,

  SMTP_HOST:
    provider === "resend"
      ? process.env.SMTP_HOST
      : process.env.BREVO_SMTP_HOST,

  SMTP_USER:
    provider === "resend"
      ? process.env.SMTP_USER
      : process.env.BREVO_SMTP_USER,

  SMTP_PASS:
    provider === "resend"
      ? process.env.SMTP_PASS
      : process.env.BREVO_SMTP_PASS,

  SMTP_PORT:
    provider === "resend"
      ? Number(process.env.SMTP_PORT)
      : Number(process.env.BREVO_SMTP_PORT),

  SMTP_SENDER:
    provider === "resend"
      ? process.env.SMTP_SENDER
      : process.env.BREVO_SMTP_SENDER,

  CLIENT_URL: process.env.CLIENT_URL,
};

// Vérification simple des paramètres SMTP essentiels
if (env.MAIL_ENABLED && (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS)) {
  throw new Error("SMTP configuration is incomplete. Server cannot start.");
}