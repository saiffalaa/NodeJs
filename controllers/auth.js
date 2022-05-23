const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const user = require("../models/user");
const { validationResult } = require("express-validator/check");

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
    oldInput: { email: "", password: "" },
  });
};
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

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
              return res.status(422).render("auth/login", {
                path: "/login",
                pageTitle: "Login",
                errorMessage: "Invalid password",
                oldInput: { email, password },
              });
            }
          })
          .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
      } else {
        if (!errors.isEmpty()) {
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid email",
            oldInput: { email, password },
          });
        }
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err, "error destroying");
    res.redirect("/");
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
    });
  }

  bcrypt
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
    oldInput: { email: "", password: "", confirmPassword: "" },
  });
};
exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("/auth/reset", {
    path: "/reset",
    pageTitle: "reset password",
    errorMessage: message,
  });
};
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err, "Error creating buffer");
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    user
      .findOne({ email: req.body.email })
      .then((usr) => {
        if (!usr) {
          req.flash("error", "Email dont exist");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        //send Mail
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};
exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  user
    .findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    })
    .then((usr) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "reset password",
        errorMessage: message,
        userId: usr._id.toString(),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postNewPassword = (req, res, next) => {
  const { password, userId } = req.body;
  user
    .findById(userId)
    .then((usr) => {
      bcrypt
        .hash(password, 12)
        .then((hashed) => {
          usr.password = hashed;
          usr.resetToken = undefined;
          usr.resetTokenExpiration = undefined;
          return usr.save();
        })
        .then((resl) => {
          res.redirect("/login");
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
