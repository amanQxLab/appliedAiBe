const { config } = require("../config/config");
const { decodeTokenData } = require("../utility/jwtHelper");
const helper = require("../utility/function");
const { verifyRefreshToken } = require("../utility/jwtHelper");
const TokenModel = require("../models/tokenSchema");
const jwt = require("jsonwebtoken");

const authorize = async (req, res, next) => {
  const tokenArr = req.headers["authorization"]?.split(" ");
  let token = "";
  if (Array.isArray(tokenArr)) {
    token = tokenArr[1];
  }

  if (token) {
    try {
      const userId = await decodeTokenData(token);
      if (!userId) {
        return helper.sendErrorResponse(
          {
            status: "failure",
            status_code: 401,
            message: "Login again to access",
            error_description: "Invalid token found",
          },
          res
        );
      }
      console.log("userId-after decode-", userId);
      const { token: dbAccessToken, refreshToken: dbRefreshToken } =
        await TokenModel.findOne({ userId });
      console.log("TokenModel obj", dbAccessToken);
      const refreshTokenIsValid = await verifyRefreshToken(dbRefreshToken);
      console.log("refreshToen is valid-", refreshTokenIsValid);

      jwt.verify(token, config.accessToken_secret, (err, payload) => {
        if (err) {
          if (token === dbAccessToken && refreshTokenIsValid) {
            return helper.sendErrorResponse(
              {
                status: "failure",
                status_code: 401,
                message: "Refresh your token to access",
                error_description:
                  "Unable to authorize user due to token expiry but you can refresh your token",
              },
              res
            );
          } else {
            return helper.sendErrorResponse(
              {
                status: "failure",
                status_code: 401,
                message: "Login again to access",
                error_description:
                  "Unable to authorize user due to token and session expiry login again.",
              },
              res
            );
          }
        } else if (token === dbAccessToken) {
          req.payload = payload;
          next();
        } else {
          return helper.sendErrorResponse(
            {
              status: "failure",
              status_code: 401,
              message: "Login again to access",
              error_description:
                "User account access detected, session expiry login again.",
            },
            res
          );
        }
      });
    } catch (error) {
      console.log("from catch--", error);
      return helper.sendErrorResponse(
        {
          status: "failure",
          status_code: 500,
          message: "Login again to access",
          error_description:
            "Unable to authorize user due to internal server error",
        },
        res
      );
    }
  } else {
    return helper.sendErrorResponse(
      {
        status: "failure",
        status_code: 401,
        message: "Login again to access",
        error_description: "Unable to authorize user because token not found",
      },
      res
    );
  }
};

module.exports = authorize;