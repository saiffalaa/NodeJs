const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (cb) => {
  mongoClient
    .connect(
      "mongodb+srv://saifalaa:861215Sa@cluster0.quanh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
    .then((res) => {
      console.log("connected");
      _db = res.db();
      cb(res);
    })
    .catch((err) => {
      console.log(err, "err");
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "no database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
// module.exports = mongoConnect;
