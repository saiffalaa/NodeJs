const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([data, fieldData]) => {
      res.render("shop/product-list", {
        prods: data,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err, "error"));
};
exports.getProduct = (req, res, next) => {
  const { id } = req.params;
  Product.getProduct(parseInt(id))
    .then(([data]) => {
      res.render(`shop/product-detail`, {
        product: data[0],
        pageTitle: `product ${id}`,
        path: `/products`,
      });
    })
    .catch((err) => console.log(err, "error"));
};
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([data, fieldData]) => {
      res.render("shop/index", {
        prods: data,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err, "error"));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cartItems) => {
    Product.fetchAll((prods) => {
      const cartDetails = [];
      for (prod of prods) {
        const data = cartItems.products.find(
          (p) => parseInt(p.id) === parseInt(prod.id)
        );
        if (data) {
          cartDetails.push({ prodData: prod, qty: data.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        product: cartDetails,
      });
    });
  });
};
exports.deleteCartItem = (req, res, next) => {
  const id = parseInt(req.body.id);
  Product.getProduct(id, (product) => {
    Cart.deleteProduct(id, product.price);
    res.redirect("/cart");
  });
};
exports.postCart = (req, res, next) => {
  const prodId = parseInt(req.body.productId);
  // console.log(prodId);
  Product.getProduct(prodId, (product) => {
    console.log(product);
    Cart.addProduct(prodId, parseInt(product.price));
  });
  res.redirect("/cart");
  // console.log(prodId, "PS");
};
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
