const express = require("express");

const authController = require("../controllers/auth");
const { check, body } = require("express-validator/check");
const User = require("../models/user");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  authController.postLogin
);
router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.post("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Email is invalid.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already exists");
          }
        });
      }),
    body("password", "Invalid password").isLength({ min: 6 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
  ],
  authController.postSignup
);
module.exports = router;
