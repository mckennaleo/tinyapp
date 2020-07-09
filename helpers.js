const generateUserID = (length, chars) => {
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

const generateRandomString = (length, chars) => {
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

const emailLookup = (email, userDatabase) => {
  for (let user in userDatabase) {
    // console.log(userDatabase[user].email);
    if (userDatabase[user].email === email) {
      return true;
    }
  }
};

const getUserByEmail = (email, userDatabase) => {
  for (let user in userDatabase) {
    // console.log(userDatabase[user].email);
    if (userDatabase[user].email === email) {
      return userDatabase[user].userID;
    }
  }
};

const urlsForUser = (ID, urlDatabase) => {
  let userURLs = {};
  // console.log(ID);
  for (let url in urlDatabase) {
    // console.log(urlDatabase[url]);
    // console.log(url);
    if (urlDatabase[url].userID === ID) {
      userURLs[url] = urlDatabase[url];

    }
  }
  // console.log(urlDatabase);
  return userURLs;
};


module.exports = {
  generateUserID,
  generateRandomString,
  emailLookup,
  getUserByEmail,
  urlsForUser
};