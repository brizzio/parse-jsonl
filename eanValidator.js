function isEAN13(str) {
    // Check if the string is a 13-digit number
    if (!/^\d{13}$/.test(str)) {
      return false;
    }
  
    // Calculate the check digit
    const checkDigit = calculateCheckDigit(str.slice(0, 12));
  
    // Compare the calculated check digit with the last digit of the input
    return parseInt(str.charAt(12), 10) === checkDigit;
  }
  
  function calculateCheckDigit(digits) {
    // Calculate the check digit based on the first 12 digits of the EAN-13
    const sum = digits
      .split('')
      .map((digit, index) => parseInt(digit, 10) * (index % 2 === 0 ? 1 : 3))
      .reduce((acc, value) => acc + value, 0);
  
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit;
  }
  
  module.exports = isEAN13;