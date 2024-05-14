require("dotenv").config({ path: ".env" });

module.exports.config = {
  accessToken_age: process.env.ACCESSTOKEN_AGE,
  refreshToken_age: process.env.REFRESHTOKEN_AGE,
  accessToken_secret: process.env.ACCESSTOKEN_SECRET,
  refreshToken_secret: process.env.REFRESHTOKEN_SECRET,
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  sendGrid_key: process.env.SENDGRID_KEY
};