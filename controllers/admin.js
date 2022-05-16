const { ObjectId } = require("mongodb");
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
  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null,
    req.user._id
  );
  product
    .save()
    .then(() => {
      console.log("Product Created");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findbyId(id).then((product) => {
    if (!product) return res.redirect("/");
    else {
      res.render("admin/edit-product", {
        pageTitle: "edit Product",
        path: "/admin/edit-product",
        isEditing: true,
        product: product,
      });
    }
  });
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, imageUrl, description, price } = req.body;
  const prod = new Product(
    title,
    price,
    description,
    imageUrl,
    new ObjectId(id)
  );
  prod
    .save()
    .then(() => {
      console.log(`product ${prod._id} UPDATED!!`);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};
exports.deleteProducts = (req, res, next) => {
  const { deletedId } = req.body;
  Product.deleteById(deletedId)
    .then(() => {
      console.log("Deleted");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err, "deletion failed"));
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};
