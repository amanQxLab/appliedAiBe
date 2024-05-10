const jwt = require('jsonwebtoken');
const { config } = require("../config/config.js");


console.log("access_Secret--", config.accessToken_secret);

async function createAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const options = {
      expiresIn: config.accessToken_age,
      issuer: "jwt-ai-app",
      audience: userId,
    };
    jwt.sign({}, config.accessToken_secret, options, (err, token) => {
      if (err) {
        return reject(
        "Error in token creation"
        );
      }
      resolve(token);
    });
  });
}

async function createRefreshToken(userId) {
  return new Promise((resolve, reject) => {
    const options = {
      expiresIn: config.refreshToken_age,
      issuer: "jwt-ai-app",
      audience: userId,
    };
    jwt.sign({}, config.refreshToken_secret, options, (err, token) => {
      if (err) {
        return reject(
          "Error in token creation"
        );
      }
      resolve(token);
    });
  });
}

module.exports = {
  createAccessToken,
  createRefreshToken,
};






















