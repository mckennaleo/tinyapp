// ----------REQUIRES----------

const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const {
  generateUserID,
  generateRandomString,
  emailLookup,
  getUserByEmail,
  urlsForUser
} = require('./helpers');
const { loginLookup } = require('./middlewares');


const app = express();
const PORT = 8080; // default port 8080
app.use(cookieSession({
  name: 'session',
  keys: ['userID']
}));

// ----------DATA----------

const urlDatabase = {
  "12xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "afifub3" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "afifub3" }
};

let userDatabase = {
  "afifub3": { userID: "afifub3", email: "abc@abc.com", password: "password" }

};

// ----------FUNCTIONS----------



// ----------APP SETUP-----------

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// ----------GETS----------

app.get("/error400", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: userDatabase[req.session.user_id]
  };
  res.render("error400", templateVars);
});

app.get("/error405", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: userDatabase[req.session.user_id]
  };
  res.render("error405", templateVars);
});

app.get("/error", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: userDatabase[req.session.user_id]
  };
  res.render("error", templateVars);
});

app.get("/errorLogin", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: userDatabase[req.session.user_id]
  };
  res.render("errorLogin", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { user: userDatabase[req.session.user_id] };
  res.render("login", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = { user: userDatabase[req.session.user_id] };
  res.render("register", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const user = userDatabase[req.session.user_id];
  if (user) {
    let templateVars = {
      urls: urlsForUser(user.userID, urlDatabase),
      user: userDatabase[req.session.user_id]
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }

});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL, longURL: req.params.longURL, user: userDatabase[req.session.user_id]
  };
  const user = userDatabase[req.session.user_id];
  if (user) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL, longURL: req.params.longURL, user: userDatabase[req.session.user_id]
  };
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/error405");
  }
});

app.get("/u/:shortURL", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: userDatabase[req.session.user_id]
  };
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
  const userID = getUserByEmail(email, userDatabase);
  
  if (loginLookup(email, password, userDatabase) === true) {
    req.session.user_id = userID;
    res.redirect("/urls");
  } else {
    res.redirect("/errorLogin");
  }
});

app.post("/logout", (req, res) => {
  // console.log(req);
  req.session = undefined;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {

  const userID = generateUserID(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.redirect("/error400");
  }
  if (emailLookup(email, userDatabase) === true) {
    res.redirect("/error");
  } else {
    userDatabase[userID] = { userID, email, password: bcrypt.hashSync(password, 10) };
    // console.log(userDatabase);
    req.session.user_id = userID;
    res.redirect("/urls");
  }
});

app.post("/urls", (req, res) => {
  let user = userDatabase[req.session.user_id];
  let shortURL = generateRandomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: user.userID };
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