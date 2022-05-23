const Product = require("../models/product");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
const pdfkit = require("pdfkit");
const stripe = require("stripe")(
  "sk_test_51L2cnvCdmO60Qx8V5uQ4K9kcgn807tJF99gDOuik9GNhdZ0J5mFan1COyPG7jabgo1HAtE1GzJ7ExdJ2YtQqNbeg00YxIm3Mpj"
);
const ITEM_PER_PAGE = 2;
exports.getProducts = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((prodNumber) => {
      totalItems = prodNumber;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        totalProducts: totalItems,
        currentPage: page,
        hasNext: ITEM_PER_PAGE * page < totalItems,
        hasPrev: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getProduct = (req, res, next) => {
  const { id } = req.params;
  Product.findById(id)
    // .findByPk(id)
    .then((data) => {
      res.render(`shop/product-detail`, {
        product: data,
        pageTitle: `product ${id}`,
        path: `/products`,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getIndex = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((prodNumber) => {
      totalItems = prodNumber;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        totalProducts: totalItems,
        currentPage: page,
        hasNext: ITEM_PER_PAGE * page < totalItems,
        hasPrev: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteCartItem = (req, res, next) => {
  const id = req.body.id;
  req.user
    .removeFromCart(id)
    .then(() => {
      console.log("Deletion Successeded");
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, nex) => {
  let products;
  let total = 0;
  req.user
    .populate("cart.items.productId")
    // .execPopulate()
    .then((user) => {
      products = user.cart.items;
      total = 0;
      products.map((p) => {
        total += p.quantity * p.productId.price;
      });
      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((p) => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: "usd",
            quantity: p.quantity,
          };
        }),
        success_url:
          req.protocol + "://" + req.get("host") + "/checkout/success",
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
      });
    })
    .then((session) => {
      res.render("shop/checkout", {
        path: "/orders",
        pageTitle: "Checkout",
        product: products,
        total,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    // .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getInovoice = (req, res, next) => {
  // console.log("ASDASD");
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order Found!!"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = `inovoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "inovoices", invoiceName);
      const pdf = new pdfkit();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "inline; filename=" + invoiceName + ""
      );
      pdf.pipe(fs.createWriteStream(invoicePath));
      pdf.pipe(res);
      pdf.fontSize(26).text("Invoice", {
        underline: true,
      });
      pdf.text("--------------------------");
      let total = 0;
      order.products.map((prod) => {
        total += prod.product.price * prod.quantity;
        pdf.text(
          `product name: ${prod.product.title} \nproduct description: ${
            prod.product.description
          } \nprice: ${prod.product.price}      Quantity: ${
            prod.quantity
          } \nOverall price: ${prod.product.price * prod.quantity}`
        );
      });
      pdf.text("-------");
      pdf.text(`total Price: ${total}`);
      pdf.end();
      console.log(invoicePath);
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     "inline; filename=" + invoiceName + ""
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);

      // file.pipe(res);
    })
    .catch((err) => next(err));
};
