


const { Router } = require("express");
const CartManager = require("../managers/CartManager");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

// POST /api/carts (crear carrito)
router.post("/", async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

// GET /api/carts/:cid (listar productos del carrito)
router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Not found" });
  res.json(cart.products);
});

// POST /api/carts/:cid/product/:pid (agregar producto al carrito)
router.post("/:cid/product/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const result = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (result.error) return res.status(404).json(result);

  res.json(result);
});

module.exports = router;