const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, prodPrice) {
    fs.readFile(p, (err, content) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(content);
      }
      const existingIndex = cart.products.findIndex((prod) => prod.id === id);
      const existing = cart.products[existingIndex];
      let updatedProduct;
      if (existing) {
        updatedProduct = { ...existing };
        updatedProduct.qty += 1;
        // cart.products = [...cart.products]
        cart.products[existingIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += prodPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
  static deleteProduct(id, price) {
    fs.readFile(p, (err, content) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(content);
      }

      let qty;
      const updatedCart = { ...cart };
      updatedCart.products = cart.products.filter((crt) => {
        if (crt.id === id) {
          qty = crt.qty;
        }
        return crt.id !== id;
      });
      updatedCart.totalPrice -= price * qty;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }
  static getCart(cb) {
    fs.readFile(p, (err, content) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(content);
        cb(cart);
      } else {
        cb(null);
      }
    });
  }
};
