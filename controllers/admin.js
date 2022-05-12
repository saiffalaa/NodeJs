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
  req.user.createProduct({
    title,
    price,
    imageUrl,
    description,
  }).then(() => {
    console.log("Product Created");
    res.redirect("/admin/products");
}).catch(err=>console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const id = parseInt(req.params.id);
  req.user.getProducts({where:{id}})
  // Product.findByPk(id)
  .then(product=>{
    if(!product)return res.redirect("/")
    else{
      res.render("admin/edit-product", {
        pageTitle: "edit Product",
        path: "/admin/edit-product",
        isEditing: true,
        product: product[0],
      })
    }
  })
};

exports.postEditProduct = (req, res, next) => {
  const { id,title,imageUrl,description,price } = req.body;
  Product.findByPk(id).then(product=>{
    product.title=title;
    product.price=price;
    product.imageUrl=imageUrl;
    product.description=description;
    return product.save()
    
  }).then(()=>{console.log(`product ${product.id} UPDATED!!`)
  res.redirect("/");}).catch(err=>console.log(err))
};
exports.deleteProducts = (req, res, next) => {
  const { deletedId } = req.body;
  Product.findByPk(deletedId).then(prod =>{
    return prod.destroy()
  }).then(()=>{console.log("product DELETED !!")
  res.redirect("/");}).catch(err=> console.log(err))
  
};
exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  // Product.findAll()
  .then(products=>{
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  }).catch(err=>console.log(err))
};
