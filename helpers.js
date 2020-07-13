const generateUserID = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

const generateRandomString = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

const emailLookup = (email, userDatabase) => {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      return true;
    }
  }
};

const getUserByEmail = (email, userDatabase) => {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user].userID;
    }
  }
};

const urlsForUser = (ID, urlDatabase) => {
  let userURLs = {};

  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === ID) {
      userURLs[url] = urlDatabase[url];
    }
  }
  return userURLs;
};

const getLongUrl = (short, urlDatabase) => {
  return urlDatabase[short].longURL;
}


module.exports = {
  generateUserID,
  generateRandomString,
  emailLookup,
  getUserByEmail,
  urlsForUser,
  getLongUrl
};