const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

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
    if (userDatabase[user].email === email && userDatabase[user].password === password) {
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

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "12xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let userDatabase = {

};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: userDatabase[req.cookies["userID"]]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL, user: userDatabase[req.cookies["userID"]]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL, user: userDatabase[req.cookies["userID"]]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  urlDatabase[shortURL] = req.body.longURL;
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

app.get("/u/:shortURL", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: userDatabase[req.cookies["userID"]]};
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  const url = "/u/" + shortURL;
  res.redirect(url);
});
 


app.get("/register", (req, res) => {
  let templateVars = {user: userDatabase[req.cookies["userID"]]};
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  
  const userID = generateUserID(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const username = req.body.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  if (username === "" || firstName === "" || lastName === "" || email === "" || password === "") {
    res.redirect("/error400");
  }
  if (emailLookup(email) === true) {
    res.redirect("/error");
  } else {
    userDatabase[userID] = {userID, username, firstName, lastName, email, password};
    console.log(userDatabase);
    res.cookie("userID", userID);
    res.redirect("/urls");
  }
});

app.get("/error400", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: userDatabase[req.cookies["userID"]]};
  res.render("error400", templateVars);
});

app.post("/error400", (req, res) => {
  
  res.redirect("/register");
});

app.get("/error", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: userDatabase[req.cookies["userID"]]};
  res.render("error", templateVars);
});

app.post("/error", (req, res) => {
  res.redirect("/register");
});

app.get("/errorLogin", (req, res) => {
  let templateVars = { urls: urlDatabase,
    user: userDatabase[req.cookies["userID"]]};
  res.render("errorLogin", templateVars);
});

app.post("/errorLogin", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  let templateVars = {user: userDatabase[req.cookies["userID"]]};
  res.render("login", templateVars);
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