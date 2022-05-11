const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    isEditing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(null, title, imageUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err, "error"));
};

exports.getEditProduct = (req, res, next) => {
  const id = parseInt(req.params.id);
  Product.getProduct(id, (product) => {
    console.log(product, id);
    res.render("admin/edit-product", {
      pageTitle: "edit Product",
      path: "/admin/edit-product",
      isEditing: true,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { id } = req.body;
  Product.editProduct(parseInt(id), req.body);
  res.redirect("/");
};
exports.deleteProducts = (req, res, next) => {
  const { deletedId } = req.body;
  Product.deleteProduct(parseInt(deletedId));
  res.redirect("/");
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
