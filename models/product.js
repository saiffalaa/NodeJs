const Cart = require("./cart");
const pool = require("../util/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.id = id;
  }

  save() {
    return pool.execute(
      "INSERT INTO products (title,price,description,imageUrl) VALUES (?,?,?,?)",
      [this.title, this.price, this.description, this.imageUrl]
    );
  }
  static editProduct(id) {}
  static getProduct(id) {
    return pool.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
  static deleteProduct(id) {}
  static fetchAll() {
    return pool.execute("SELECT * FROM products");
  }
};
