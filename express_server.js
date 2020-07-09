// ----------REQUIRES----------

const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(cookieParser());

// ----------DATA----------

const urlDatabase = {
  "12xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "afifub3" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "afifub3"}
};

let userDatabase = { "afifub3": {userID: "afifub3", email: "abc@abc.com", password: "password"}

};

// ----------FUNCTIONS----------

const generateRandomString = (length, chars) => {
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

const generateUserID = (length, chars) => {
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

const emailLookup = (email) => {
  for (let user in userDatabase) {
    // console.log(userDatabase[user].email);
    if (userDatabase[user].email === email) {
      return true;
    }
  }
};

const loginLookup = (email, password) => {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email && bcrypt.compareSync(password, userDatabase[user].password) === true) {
      return true;
    }
  }
};

const IDLookup = (email) => {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user].userID;
    }
  }
};

const urlsForUser = (ID) => {
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

// ----------APP SETUP-----------

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// ----------GETS----------

app.get("/error400", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: userDatabase[req.cookies["userID"]]};
  res.render("error400", templateVars);
});

app.get("/error405", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: userDatabase[req.cookies["userID"]]};
  res.render("error405", templateVars);
});

app.get("/error", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: userDatabase[req.cookies["userID"]]};
  res.render("error", templateVars);
});

app.get("/errorLogin", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: userDatabase[req.cookies["userID"]]};
  res.render("errorLogin", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {user: userDatabase[req.cookies["userID"]]};
  res.render("login", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {user: userDatabase[req.cookies["userID"]]};
  res.render("register", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const user = userDatabase[req.cookies["userID"]];
  if (user) {
    let templateVars = { urls: urlsForUser(userDatabase[req.cookies.userID].userID),
      user: userDatabase[req.cookies["userID"]]};
    // console.log(urlsForUser(user));
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
  
});

app.get("/urls/new", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL, user: userDatabase[req.cookies["userID"]]
  };
  const user = userDatabase[req.cookies["userID"]];
  if (user) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL, user: userDatabase[req.cookies["userID"]]
  };
  if (req.cookies["userID"] === urlDatabase[req.params.shortURL].userID) {
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/error405");
  }
});

app.get("/u/:shortURL", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: userDatabase[req.cookies["userID"]]};
  const longURL = urlDatabase[req.params.shortURL].longURL;
  // console.log(urlDatabase);
  res.redirect(longURL);
});

//  ----------POSTS----------

app.post("/error400", (req, res) => {
  
  res.redirect("/register");
});

app.post("/error405", (req, res) => {
  
  res.redirect("/urls");
});

app.post("/error", (req, res) => {
  res.redirect("/register");
});

app.post("/errorLogin", (req, res) => {
  res.redirect("/login");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = IDLookup(email);
  if (loginLookup(email, password) === true) {
    res.cookie("userID", userID);
    res.redirect("/urls");
  } else {
    res.redirect("/errorLogin");
  }
});

app.post("/logout", (req, res) => {
  // console.log(req);
  res.clearCookie("userID");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  
  const userID = generateUserID(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.redirect("/error400");
  }
  if (emailLookup(email) === true) {
    res.redirect("/error");
  } else {
    userDatabase[userID] = {userID, email, password: bcrypt.hashSync(password, 10)};
    // console.log(userDatabase);
    res.cookie("userID", userID);
    res.redirect("/urls");
  }
});

app.post("/urls", (req, res) => {
  let user = userDatabase[req.cookies["userID"]];
  let shortURL = generateRandomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: user.userID};
  // console.log(urlDatabase);
  const url = "/u/" + shortURL;
  // console.log('redirecting to: ', url);
  res.redirect(url);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // console.log(req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  const url = "/u/" + shortURL;
  res.redirect(url);
});