class Validations {
  isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isPasswordValid(password) {
    return password.length >= 6;
  }
}

module.exports = new Validations();
