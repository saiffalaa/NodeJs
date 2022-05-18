const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  console.log(message);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((result) => {
            if (result) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              req.session.save((err) => {
                res.redirect("/");
              });
            } else {
              console.log("Password is invalid");
              req.flash("error", "Invalid password");
              res.redirect("/login");
            }
          })
          .catch((err) => {
            console.log(err, "failed to compare");
            res.redirect("/login");
          });
      } else {
        req.flash("error", "Email not exists.");
        console.log("email not exists");
        res.redirect("/login");
      }
    })
    .catch((err) => console.log(err, "Error finding user"));
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err, "error destroying");
    res.redirect("/");
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  //Validate function...After Validation
  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashed) => {
          const user = new User({
            email,
            password: hashed,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })

    .catch((err) => console.log(err, "Error signingup user"));
};
exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};
