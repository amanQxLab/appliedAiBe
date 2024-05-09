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

module.exports = {validationData}