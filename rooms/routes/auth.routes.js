const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;

/* GET signup page */
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  User.create({ fullName, email, password: passwordHash })
    .then((newUser) => {
      req.session.currentUser = { newUser };
      res.redirect(`/auth/profile`);
    })
    .catch((err) => console.log(err));
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  console.log("SESSION =====> ", req.session);
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      console.log("user", user);
      if (!user) {
        // if user is not found in the DB
        res.render("auth/login", {
          errorMessage: "Username is not registered. Try with other email.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
       
        const { fullName, email } = user;
        req.session.currentUser = { fullName, email }; // creating the property currentUser
        res.redirect("/auth/profile");
      } else {
        // if password is incorect
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => console.log(error));
});

router.get("/profile", (req, res) => {
  console.log(req.session.currentUser);
  res.render("auth/profile", req.session.currentUser);
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

module.exports = router;
