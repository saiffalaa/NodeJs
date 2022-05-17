const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const errorController = require("./controllers/error");
const session = require("express-session");
const app = express();
const mongoStore = require("connect-mongodb-session")(session);
const MONGO_URI =
  "mongodb+srv://saifalaa:861215Sa@cluster0.quanh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const store = new mongoStore({
  uri: MONGO_URI,
  collection: "sessions",
});
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const User = require("./models/user");
const user = require("./models/user");

// const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secrete",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGO_URI)
  .then((res) => {
    console.log("connected");
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "saif",
          email: "saif@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => console.log(err, "error connecting to database"));
