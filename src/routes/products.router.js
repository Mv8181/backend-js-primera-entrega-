


const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const manager = new ProductManager();


router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

router.post("/", async (req, res) => {
  const result = await manager.addProduct(req.body);
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
});


router.put("/:pid", async (req, res) => {
  const result = await manager.updateProduct(req.params.pid, req.body);
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

router.delete("/:pid", async (req, res) => {
  const result = await manager.deleteProduct(req.params.pid);
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

module.exports = router;