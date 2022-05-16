const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
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
      });
    })
    .catch((err) => console.log(err, "error"));
};
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((prods) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        product: prods,
      });
    })
    .catch((err) => console.log(err, "error returning cart"));
  // .then((cart) => {
  //   return cart.getProducts();
  // })
  // .then((cartProducts) => {
  //   res.render("shop/cart", {
  //     path: "/cart",
  //     pageTitle: "Your Cart",
  //     product: cartProducts,
  //   });
  // })
  // .catch((err) => console.log(err));
};

exports.deleteCartItem = (req, res, next) => {
  const id = req.body.id;
  req.user
    .deleteFromCart(id)
    .then(() => {
      console.log("Deletion Successeded");
      res.redirect("/cart");
    })
    .catch((err) => console.log(err, "deleting failed"));
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findbyId(prodId)
    .then((prod) => {
      // console.log(prod, "From post Cart");
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
    .addOrder()
    .then((result) => {
      console.log("order added successfully");
      res.redirect("/orders");
    })
    .catch((err) => console.log(err, "error adding order"));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrder().then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  });
};
