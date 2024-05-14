const UserModel = require('../models/userSchema');
const TokenModel = require('../models/tokenSchema')
const {validationData} = require("../utility/function")
const helper =  require('../utility/function')
const bcrypt = require('bcrypt')
const {createAccessToken, createRefreshToken, decodeTokenData, verifyRefreshToken} = require("../utility/jwtHelper")


module.exports.login = async (req, res, next) => {
  try {
    
    const body = req.body
    const {googleId, email} = body
    if (googleId && email) {
      const validatateData = await validationData(body, ['googleId','email'])
    
      if (validatateData && validatateData.status) {
        return helper.sendErrorResponse({
                status: "failure",
                status_code: 400,
                message: validatateData.error,
                data: {}},res);
          }
      const userByEmail = await UserModel.findOne({ email });
      const userByGoodleId = await UserModel.findOne({ 'thirdPartyLogin.googleId': googleId });
      if (!userByEmail && userByGoodleId) {
        return helper.sendErrorResponse(
          {
            status: "failure",
            status_code: 401,
            message: "Invalid email",
            error_description: "Unable to authorize user with invalid googleId",
          },
          res
        );
      } else if (userByEmail && !userByGoodleId) {
       return helper.sendErrorResponse(
          {
            status: "failure",
            status_code: 401,
            message: "Account exist reset password and login again",
            error_description:
              "User with provided email already exist you need to reset password to login again.",
          },
          res
        );
      } else if (!userByEmail && !userByGoodleId) {
        const user = new UserModel({
          fName: "",
          lName: "",
          email,
          thirdPartyLogin: {
            googleId: googleId,
          },
          verified: true,
          status: false,
          userType: "Personal",
        });
        const savedUser = await user.save();
        const addedUser = await UserModel.findById(savedUser._id);
        console.log("addedUser-", addedUser);
        const accessToken = await createAccessToken(addedUser._id.toString());
        const refreshToken = await createRefreshToken(addedUser._id.toString());
        const tokenObj = {
          token: accessToken,
          refreshToken: refreshToken,
          status: false,
          userId: addedUser._id,
        };
        const tokenObjSaved = await TokenModel.create(tokenObj);
        return helper.sendSuccessResponse(
          {
            status: "success",
            status_code: 200,
            message: "User added and loggedin successfully",
            data: {
              accessToken: tokenObjSaved.token,
            },
          },
          res
        );
      } else if (userByEmail?._id.toString() !== userByGoodleId?._id.toString()) {
        return helper.sendErrorResponse(
          {
            status: "failure",
            status_code: 401,
            message: "Invalid email or googleId",
            error_description:
              "Unable to authorize user with invalid email or googleId",
          },
          res
        );
      } else if (userByEmail?._id.toString() === userByGoodleId?._id.toString()) {
        const userObj = userByEmail.toObject();
        if (userObj) {
          delete userObj.password;
        }
        const accessToken = await createAccessToken(userByEmail._id.toString());
        const refreshToken = await createRefreshToken(
          userByEmail._id.toString()
        );
        const tokenObj = await TokenModel.findOne({ userId: userByEmail._id });

        tokenObj.token = accessToken;
        tokenObj.refreshToken = refreshToken;
        await tokenObj.save();

        return helper.sendSuccessResponse(
          {
            status_code: 200,
            status: "success",
            message: "User loggedin successfully",
            data: {
              user: userObj,
              token: accessToken,
            },
          },
          res
        );
      }
    } 
 else{
      const validatateData = await validationData(body, ['email','password'])
    
      if (validatateData && validatateData.status) {
        return helper.sendErrorResponse({
                status: "failure",
                status_code: 400,
                message: validatateData.error,
                data: {}},res);
          }
  
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      console.log(user);
      if (!user) {
        return helper.sendErrorResponse({
          status: "failure",
          status_code: 400,
          message: "Email id does not exits",
          data: {}},res);
      }
     const isPassMatch =  await bcrypt.compare(password, user.password);
      if (isPassMatch) {
        const userObj = user.toObject();
        delete userObj.password;
        const accessToken = await createAccessToken(user._id.toString());
        const refreshToken = await createRefreshToken(user._id.toString());
        const tokenObj = await TokenModel.findOne({ userId: user._id });
  
        tokenObj.token = accessToken;
        tokenObj.refreshToken = refreshToken;
        await tokenObj.save();
        return helper.sendSuccessResponse({ message: 'User loggedin successfully!!', data: {accessToken: accessToken}}, res);
      } else {
        return helper.sendErrorResponse({
          status: "failure",
          status_code: 400,
          message: "Invalid password",
          data: {}},res);
        }
    }
    
  } catch (error) {
    console.error('Error login user:', error);
        return helper.sendErrorResponse({
          status: "failure",
          status_code: 500,
          message: "Internal server error..",
          data: {}},res);
  }
};


module.exports.signup = async (req, res) => {
    try {
        const body = req.body
        const validatateData = await validationData(body, ['fName','lName','email','password','userType'])
        if (validatateData && validatateData.status) {
          return helper.sendErrorResponse({
                  status: "failure",
                  status_code: 400,
                  message: validatateData.error,
                  data: {}},res);
            }

        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
          return helper.sendErrorResponse({
                status: "failure",
                status_code: 400,
                message: "Email already exists.",
                data: {}},res);
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        body.password = hashedPassword
        const newUser = new UserModel(body);
        await newUser.save().then(async(userdata)=>{
          console.log("yss", userdata._id)
              const accessToken = await createAccessToken(userdata._id.toString())
              const refreshToken = await createRefreshToken(userdata._id.toString())
              console.log("---", accessToken, "rrrr", refreshToken)
              const newToken = new TokenModel({
                token: accessToken,
                refreshToken: refreshToken,
                userId: userdata._id
              })
              await newToken.save().then((Success)=>{
                return helper.sendSuccessResponse({ message: 'User Registred Successfully!!', data: {accessToken: accessToken}}, res);
              }).catch((errr)=>{
                return helper.sendErrorResponse({
                  status: "failure",
                  status_code: 400,
                  message: "Somthing went wrong in token creation",
                  data: {}},res);
                  
              })
        }).catch((err)=>{
         return helper.sendErrorResponse({
            status: "failure",
            status_code: 400,
            message: "Somthing went wrong in user creation",
            data: {}},res);
        })
      } catch (error) {
        console.error('Error registering user:', error);
        return helper.sendErrorResponse({
          status: "failure",
          status_code: 500,
          message: "Internal server error..",
          data: {}},res);
      }
      
}



module.exports.refreshAccessToken = async (req, res) => {
  const tokenArr = req.headers["authorization"]?.split(" ");
  let expAccessToken = "";
  if (Array.isArray(tokenArr)) {
    expAccessToken = tokenArr[1];
  }


  if (expAccessToken) {
    try {
      const userId = await decodeTokenData(expAccessToken);
      
      if (!userId) {
        return helper.sendErrorResponse(
          {
            status: "failure",
            status_code: 401,
            message: "Unauthorized: Invalid token found",
          },
          res
        );
      }
      const userTokens = await TokenModel.findOne({ userId });
      
      if (!userTokens) {
        return helper.sendErrorResponse(
          {
            status: "failure",
            status_code: 401,
            message: "Unauthorized: UserId not found",
          },
          res
        );
      }
      const { token: accessToken, refreshToken } = userTokens;
      if (accessToken !== expAccessToken) {
        return helper.sendErrorResponse(
          {
            status: "failure",
            status_code: 401,
            message: "Unauthorize: System login detected login again",
          },
          res
        );
      }
      const refreshTokenIsValid =  await verifyRefreshToken(refreshToken);
      console.log('refershedTokenIsValid---',refreshTokenIsValid)
      if (!refreshTokenIsValid) {
        return helper.sendErrorResponse(
          {
            status: "failure",
            status_code: 401,
            message: "Unauthorized: Session expired login again",
          },
          res
        )
      }
      const user = await UserModel.findOne({ _id: userId }).select(
        "-password -createdAt -__v -updatedAt"
      );
      const newAccessToken = await createAccessToken(userId);
      userTokens.token = newAccessToken;
      await userTokens.save();

      return helper.sendSuccessResponse(
        {
          status: "success",
          status_code: 200,
          message: "Success: Token refreshed successfully",
          data: {
            user: user,
            token: newAccessToken,
          },
        },
        res
      );
    } catch (error) {
      console.log(error);
      return helper.sendErrorResponse(
        {
          status: "failure",
          status_code: 500,
          message: "Internal server error : Unable to refresh token",
        },
        res
      );
    }
  } else {
    return helper.sendErrorResponse(
      {
        status: "failure",
        status_code: 400,
        message: "Bad request: Expired token not found",
      },
      res
    );
  }
};

module.exports.homeHandler = async (req, res) => {
  return helper.sendSuccessResponse(
    {
      status: "success",
      status_code: 200,
      message: "Success: Accessed successfully",
      data: {},
    },
    res
  );
};