// User.js
export class User {
  constructor(data = {}) {
    const {
      id = null,
      email = null,
      password = null,
      latitude = null,
      longitude = null,
      is_verified = false,
      verification_token = null
    } = data;

    this.id = id;

    this.email = typeof email === "string" ? email : null;

    this.password = password;

    this.latitude = typeof latitude === "number" ? latitude : null;
    this.longitude = typeof longitude === "number" ? longitude : null;

    this.is_verified = Boolean(is_verified);

    this.verification_token = verification_token;
  }


  /**
   * Retourne uniquement les champs safe pour l’API
   */
  toJSONSafe() {
    return {
      id: this.id,
      email: this.email,
      latitude: this.latitude,
      longitude: this.longitude,
      is_verified: this.is_verified,
    };
  }
}