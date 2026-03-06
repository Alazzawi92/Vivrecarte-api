import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { v4 as uuid4 } from "uuid";
import { env } from "../config/env.js";
import { userRepository } from "../repositories/user.repository.js";
import { MailService } from "./mail.service.js";

export const AuthService = {

  // ================= INSCRIPTIOn ====================//
  async register(email, password) {
    const hashed = await argon2.hash(password);
    //   const verificationToken = crypto.randomBytes(32).toString("hex");
    const verification_token = uuid4();

    const userid = await userRepository.create({
      email,
      password: hashed,
      verification_token,
    });

    // On envoie l'email de vérification

    await MailService.sendVerificationEmail(email, verification_token);

    return userid;
  },


  // ========= LOGIN  ==============//

  async login(email, password) {
    // email
    const user = await userRepository.findByEmail(email);
    console.log(email, user, user.password, env.JWT_SECRET);
    if (!user || !user.password) throw new Error( env.JWT_SECRET,"L'utilsateur n'existe pas  ou le mot de passe ou sami ou je sais pas ");

    

    // password
    const valid = await argon2.verify(user.password, password);
    if (!valid) throw new Error("Invalid creadentials");

    // Le token

    return jwt.sign(
      {
        id: user.id,
      },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );
  },

  // vérifier l'utilisateur apres inscription 

  async verifyUser(token) {
 

    const user = await userRepository.findByToken(token);

    if (!user) return null;

    await userRepository.updateVérification(user.id);

    return user;
  },
};
