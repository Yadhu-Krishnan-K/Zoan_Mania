const otpGenerator = require('otp-generator')

const generateOtp = () => {
  let otp = otpGenerator.generate(4,
    {
      digits: true,
      specialChars: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false
    })
  console.log(otp)
  return otp
}

module.exports = {
    generateOtp
}
