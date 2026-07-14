const crypto = require("crypto");

 //Generate a random 6-digit verification code.
 
function generateVerificationCode() {
    return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Generate a secure random token.
 * Useful for password reset or email change links.
 */
function generateTokenHash() {
    return crypto.randomBytes(32).toString("hex");
}

/**
 * Returns the expiration time.
 * Default: 10 minutes from now.
 */
function generateExpiryTime(minutes = 10) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
    return expiresAt;
}

module.exports = {
    generateVerificationCode,
    generateTokenHash,
    generateExpiryTime,
};