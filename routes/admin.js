const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator/check");
const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title").isAlphanumeric().isLength({ min: 2 }).trim(),
    body("price").isNumeric().trim(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:id", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").isLength({ min: 2 }).trim(),
    body("price").isNumeric().trim(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

router.delete("/product/:deletedId", isAuth, adminController.deleteProducts);

module.exports = router;
