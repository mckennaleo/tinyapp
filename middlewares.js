const bcrypt = require('bcrypt');

const loginLookup = (email, password, userDatabase) => {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email && bcrypt.compareSync(password, userDatabase[user].password) === true) {
      return true;
    }
  }
};

module.exports = { loginLookup };