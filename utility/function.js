const expression =/^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/

const validationData = async function (reqData, validateData) {
  const validationResponse = {
    error: '',
    status: false,
  }
  
  for (const field of validateData) {
    if (reqData[field]) {
      const validateField = reqData[field].trim()
      if (!validateField || validateField === '' || validateField === null) {
        validationResponse.error = `${field} is Required!`
        validationResponse.status = true
        break
      }

      if (field === 'email') {
        if (!expression.test(validateField)) {
          console.log('invalid email')
          validationResponse.error = 'Invalid email id'
          validationResponse.status = true
          break
        }
      }
    } else {
      validationResponse.error = `${field} is Required!`
      validationResponse.status = true
      break
    }
  }

  return validationResponse
}


let sendErrorResponse = function(err, res) {
  return res.status(err.status_code || 500).send({
    status: "failure",
    status_code: err.status_code || 500,
    message: err.message,
    error_description: err.error_description || "",
    data: err.data || {},
  });
};

let sendSuccessResponse = function(result, res, other) {
  let totalcount = result.count ? result.count : "";
  let sendData = {
    status: "success",
    status_code: result.status_code || 200,
    message: result.message || "SUCCESS!",
    data: result.data || {},
    ...totalcount,
  };
  sendData = { ...sendData, ...other };
  //console.log("status_code", sendData);
  return res.status(result.status_code || 200).send(sendData);
};

module.exports = {validationData, sendSuccessResponse, sendErrorResponse}