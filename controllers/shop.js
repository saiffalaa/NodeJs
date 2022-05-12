const Product = require("../models/product");


exports.getProducts = (req, res, next) => {
  Product.findAll().then(products=>{
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  }).catch(err=>console.log(err));
};
exports.getProduct = (req, res, next) => {
  const { id } = req.params;
  Product.findByPk(id).then(data=>{
    res.render(`shop/product-detail`, {
      product: data,
      pageTitle: `product ${id}`,
      path: `/products`,
  })
}).catch((err) => console.log(err, "error"));
};
exports.getIndex = (req, res, next) => {
  Product.findAll().then(products=>{
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  }).catch(err=>console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then(cart=>{
    return cart.getProducts()
  }).then(cartProducts=>{
    res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            product: cartProducts,
          });
  }).catch(err=>console.log(err))
};

exports.deleteCartItem = (req, res, next) => {
  const id = parseInt(req.body.id);
  req.user.getCart().then(cart=>{
    return cart.getProducts({where:{id}})
  }).then(product=>{
    const prod = product[0];
    return prod.cartItem.destroy();
  }).then(()=>res.redirect("/cart"))
  Product.findByPk
};
exports.postCart = (req, res, next) => {
  const prodId = parseInt(req.body.productId);
  let quantity=1;
  let fetchedCart;
  req.user.getCart()
  .then(cart=> {
    fetchedCart= cart;
    return cart.getProducts({where:{id:prodId}})})
  .then(cartItem=>{
    if(cartItem[0]){
      console.log(cartItem[0])
      quantity= cartItem[0].cartItem.quantity+1;
      return cartItem
    }
    return Product.findByPk(prodId)
  })
  .then((product)=>{
      return fetchedCart.addProduct(product,{through : {quantity}})
  })
  .then(()=>res.redirect("/cart"))
  .catch(err=> console.log(err))
};

exports.postOrder = (req,res,next)=>{
  let fetchedCart;
  req.user.getCart().then(cart=>{
    fetchedCart=cart;
    return cart.getProducts()
  }).then(products=>{
    return req.user.createOrder().then(order=>{
     return order.addProducts(products.map((p)=>{
        p.orderItem = {
          quantity:p.cartItem.quantity
        }
        return p
      }))
    }).then(()=>{
      return fetchedCart.setProducts(null);
    }).then(()=>{
      res.redirect("/orders")
    })
  })
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include:["products"]}).then(orders=>{
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders:orders,
    });
  })
};

