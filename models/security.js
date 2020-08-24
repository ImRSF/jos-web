const aes256 = require("aes256");
const crypto = require("crypto");

// To-Do : 
// - Refer to Udemy Authentication Section of the Video
// - Change Authentication Protocol so that it may be compatible with the VB Application
// - Validation
module.exports = class Security {
  static encryptPassword(password) {
    const key = crypto.createHash('sha256').update(password).digest("hex")
    const salt = crypto.randomBytes(4).toString('hex');
    const originalHash = aes256.encrypt(key, password);
    const firstPart = originalHash.substring(0, originalHash.length / 2);
    const secondPart = originalHash.substring(
      originalHash.length / 2,
      originalHash.length
    );
    const encryptedPassword =
      salt.substring(0, 2) +
      firstPart +
      salt.substring(2, 6) +
      secondPart +
      salt.substring(6, 8);
    return encryptedPassword;
  }

  static decryptPassword(encryptedPassword, password = "") {
    const keyPassword = crypto.createHash('sha256').update(password).digest("hex")
    const firstPart = encryptedPassword.substring(
      0,
      encryptedPassword.length / 2
    );
    const secondPart = encryptedPassword.substring(
      encryptedPassword.length / 2,
      encryptedPassword.length
    );
    const originalHash =
      firstPart.substring(2, firstPart.length - 2) +
      secondPart.substring(2, secondPart.length - 2);
    return aes256.decrypt(keyPassword, originalHash); 
  }

  static async generateToken() {  
    const msInTenMins = 600000; 
    const expiration = Date.now() + msInTenMins;
    const token = {
      "value": crypto.randomBytes(32).toString("hex"),
      "expirationDate": expiration.toString()
    }
    return token;
  }
};
