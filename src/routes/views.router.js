const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

module.exports = router;
