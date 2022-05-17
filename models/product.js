const mongoose = require("mongoose");

const schema = mongoose.Schema;

const productSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);

// const { ObjectId } = require("mongodb");

// const getDb = require("../util/database").getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id;
//     this.userId = userId;
//   }
//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       console.log("here");
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: new ObjectId(this._id) }, { $set: this });
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((prods) => {
//         console.log(prods);
//         return prods;
//       })
//       .catch((err) => console.log(err));
//   }
//   static findbyId(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new ObjectId(id) })
//       .next()
//       .then((prod) => {
//         // console.log(prod, "From product model");
//         return prod;
//       })
//       .catch((err) => console.log(err));
//   }
//   static deleteById(id) {
//     const db = getDb();
//     return db.collection("products").deleteOne({ _id: new ObjectId(id) });
//   }
// }

// module.exports = Product;
