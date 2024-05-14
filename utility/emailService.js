const sgMail = require("@sendgrid/mail");
const { config } = require("../config/config");
sgMail.setApiKey(config.sendGrid_key);
module.exports.sendMail = async (toEmail, otp) => {
  const msg = {
    to: toEmail, // Change to your recipient
    from: "aman.agarwal@qxlabai.com", // Change to your verified sender
    subject: "Reset otp Password",
    text: `Otp for resetting your password is ${otp}`,
    // html: "<strong>Otp is valid for 5 min.</strong>",
  };
  const response = await sgMail.send(msg);

  if (response && response[0].statusCode == 202) {
    return true;
  }
  return false;
};
