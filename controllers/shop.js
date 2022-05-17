const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
exports.getProduct = (req, res, next) => {
  const { id } = req.params;
  Product.findbyId(id)
    // .findByPk(id)
    .then((data) => {
      res.render(`shop/product-detail`, {
        product: data,
        pageTitle: `product ${id}`,
        path: `/products`,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err, "error"));
};
exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    // .execPopulate()
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        product: user.cart.items,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err, "error returning cart"));
};

exports.deleteCartItem = (req, res, next) => {
  const id = req.body.id;
  req.user
    .removeFromCart(id)
    .then(() => {
      console.log("Deletion Successeded");
      res.redirect("/cart");
    })
    .catch((err) => console.log(err, "deleting failed"));
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((prod) => {
      // console.log(prod, "From post Cart");
      // console.log(req.user);
      return req.user.addToCart(prod);
    })
    .then((result) => {
      console.log("Product Added to the cart successfully!");
      res.redirect("/cart");
    })
    .catch((err) => console.log(err, "Error posting cart"));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    // .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      console.log("order added successfully");
      return req.user.clearCart();
    })
    .then((result) => {
      console.log("cart cleared");
      res.redirect("/orders");
    })
    .catch((err) => console.log(err, "error adding order"));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id }).then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};
