const bcrypt = require('bcrypt');
const { userDatabase } = require('./databases');

const loginLookup = (req, res, next) => {
  const {email, password} = req.body;

  for (let user in userDatabase) {
    if (userDatabase[user].email === email && bcrypt.compareSync(password, userDatabase[user].password) === true) {
      next();
    }
  }
  res.redirect('./errorLogin');
};

module.exports = { loginLookup };