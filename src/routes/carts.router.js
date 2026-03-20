


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

// GET /api/carts/:cid (con populate)
router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartPopulated(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Not found" });
  res.json(cart);
});

// POST /api/carts/:cid/product/:pid (agregar producto al carrito)
router.post("/:cid/product/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const result = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (result.error) return res.status(404).json(result);

  res.json(result);
});

// DELETE /api/carts/:cid/products/:pid (eliminar producto del carrito)
router.delete("/:cid/products/:pid", async (req, res) => {
  const result = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

// PUT /api/carts/:cid (reemplazar todos los productos)
router.put("/:cid", async (req, res) => {
  // Body esperado: { products: [ { product: "<productId>", quantity: 2 }, ... ] }
  const productsArray = req.body.products;
  if (!Array.isArray(productsArray)) {
    return res.status(400).json({ error: "Body inválido. Se espera { products: [] }" });
  }

  const result = await cartManager.updateCart(req.params.cid, productsArray);
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

// PUT /api/carts/:cid/products/:pid (actualizar SOLO quantity)
router.put("/:cid/products/:pid", async (req, res) => {
  const { quantity } = req.body;
  if (quantity === undefined) return res.status(400).json({ error: "Falta quantity" });

  const result = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

// DELETE /api/carts/:cid (vaciar carrito)
router.delete("/:cid", async (req, res) => {
  const result = await cartManager.clearCart(req.params.cid);
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

module.exports = router;
