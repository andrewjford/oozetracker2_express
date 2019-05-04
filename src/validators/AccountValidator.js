import * as EmailValidator from 'email-validator';

// requires 8+ password length
// can use any alphanumeric and the standard symbols
const passwordRegex = new RegExp('^[A-Za-z\d!@#$%^&*()_+\-=].{7,}$');

const AccountValidator = {
  onCreate(req) {
    const errors = [];
    if (!req.body.name, !req.body.email, !req.body.password) {
      errors.push('Missing required param(s)');
    }
    if (!EmailValidator.validate(req.body.email)) {
      errors.push('Invalid email format');
    }

    if (!passwordRegex.test(req.body.password)) {
      errors.push('Password must be at least 8 characters long, and include only alphanumerics and standard symbols');
    }

    return errors;
  }
}

export default AccountValidator;