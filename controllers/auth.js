const user = require("../models/user");

exports.getLogin = (req, res, next) => {
  // console.log(req.get("Cookie"));
  // const isLoggedIn = req.get("Cookie").trim().split("=")[1] === "true";
  // console.log(isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};
exports.postLogin = (req, res, next) => {
  user
    .findById("6282805a0ccaaac1a1afa5b2")
    .then((user) => {
      console.log(user);
      req.session.user = user;
    })
    .catch((err) => console.log(err, "Error finding user"));
  req.session.isLoggedIn = true;
  res.redirect("/");
};
exports.postLogout = (req, res, next) => {
  console.log("ASDASDASD");
  req.session.destroy((err) => {
    console.log(err, "error destroying");
    res.redirect("/");
  });
};
