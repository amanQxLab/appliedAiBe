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



const decodeTokenData = async (expAccessToken) => {
  if (expAccessToken) {
    try {
      const decoded = await jwt.decode(expAccessToken);
      const userId = decoded.aud;
      return userId;
    } catch (error) {
      return new Error("Error in decoding userId from access-token");
    }
  } else {
    return null;
  }
};



const verifyRefreshToken = (token) => {
  if (!token) {
    return Promise.resolve(false);
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, config.refreshToken_secret, (err, payload) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
module.exports = {
  createAccessToken,
  createRefreshToken,
  decodeTokenData,
  verifyRefreshToken
};






















