const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const errorController = require("./controllers/error");
const session = require("express-session");
const nodemailer = require("nodemailer");
const app = express();
const mongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const MONGO_URI =
  "mongodb+srv://saifalaa:861215Sa@cluster0.quanh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const store = new mongoStore({
  uri: MONGO_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");
const csrfProtection = csrf();
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const User = require("./models/user");
const flash = require("connect-flash");
const multer = require("multer");
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   auth: {
//     user: "brannon.hansen68@ethereal.email",
//     pass: "ApZDaQbJaJNkndEN16",
//   },
// });

// var mailOptions = {
//   from: "asdasd@gmail.com",
//   to: "saifalaa95@gmail.com",
//   subject: "Sending Email using Node.js",
//   text: "That was easy!",
// };
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secrete",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash());
app.use(csrfProtection);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (user) req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// app.get(errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.isLoggedIn,
  });
});

mongoose
  .connect(MONGO_URI)
  .then((res) => {
    console.log("connected");
    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Email sent: " + info.response);
    //   }
    // });
    app.listen(3000);
  })
  .catch((err) => console.log(err, "error connecting to database"));
