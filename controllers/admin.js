const Product = require("../models/product");
const { validationResult } = require("express-validator/check");
const fileDelete = require("../util/file");
const product = require("../models/product");
exports.getAddProduct = (req, res, next) => {
  // console.log("ASDASDASDASD");
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    isEditing: false,
    hasError: false,
    errorMessage: null,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body;

  const image = req.file;
  // console.log(image);
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "add Product",
      path: "/admin/edit-product",
      isEditing: false,
      hasError: true,
      product: { title, description, price },
      errorMessage: "Attached files is not an image.",
    });
  }
  const imageUrl = image.path;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "add Product",
      path: "/admin/edit-product",
      isEditing: false,
      hasError: true,
      product: { title, imageUrl, description, price },
      errorMessage: errors.array()[0].msg,
    });
  }
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then(() => {
      console.log("Product Created");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  // console.log("ASDHGFDFGHJHGF");
  const id = req.params.id;
  Product.findById(id)
    .then((product) => {
      // throw new Error("painsd");
      if (!product) return res.redirect("/");
      else {
        const { title, description, price } = product;
        // console.log(title, description, price);
        res.render("admin/edit-product", {
          pageTitle: "edit Product",
          path: "/admin/edit-product",
          isEditing: true,
          product: { title, description, price },
          hasError: false,
          errorMessage: null,
        });
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, description, price } = req.body;
  const image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "edit Product",
      path: "/admin/edit-product",
      isEditing: true,
      hasError: true,
      product: { title, description, price },
      errorMessage: errors.array()[0].msg,
    });
  }
  Product.findById(id)
    .then((prod) => {
      if (prod.userId.toString() === req.user._id.toString()) {
        prod.title = title;
        if (image) {
          fileDelete.deleteFile(product.imageUrl);
          prod.imageUrl = image.path;
        }
        prod.description = description;
        prod.price = price;
        return prod.save().then(() => {
          console.log(`product UPDATED!!`);
          res.redirect("/");
        });
      }
      return res.redirect("/");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.deleteProducts = (req, res, next) => {
  const { deletedId } = req.params;
  product
    .findById(deletedId)
    .then((prod) => {
      if (!prod) return next(new Error("Product not found"));
      fileDelete.deleteFile(prod.imageUrl);
      return Product.deleteOne({ _id: deletedId, userId: req.user._id });
    })
    .then(() => {
      console.log("Deleted");
      res.status(200).json({ message: "Deleted Successfully" });
      // res.redirect("/admin/products");
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting Failed" });
    });
};
exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
