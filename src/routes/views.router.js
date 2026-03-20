


const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");
const CartManager = require("../managers/CartManager");

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Home (lo dejamos)
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

// Realtime (lo dejamos)
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

// /products (lista paginada)
router.get("/products", async (req, res) => {
  const { limit, page, sort, query } = req.query;

  const result = await productManager.getProductsPaginated({
    limit,
    page,
    sort,
    query
  });

  // Links para paginación en la vista
  const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
  const makeLink = (p) => {
    if (!p) return null;
    const params = new URLSearchParams();
    params.set("page", p);
    params.set("limit", limit || 10);
    if (sort) params.set("sort", sort);
    if (query) params.set("query", query);
    return `${baseUrl}?${params.toString()}`;
  };

  res.render("index", {
    products: result.docs,
    page: result.page,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: makeLink(result.prevPage),
    nextLink: makeLink(result.nextPage)
  });
});

// /products/:pid (detalle del producto)
router.get("/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).send("Not found");
  res.render("productDetail", { product });
});

// /carts/:cid (ver carrito con populate)
router.get("/carts/:cid", async (req, res) => {
  const cart = await cartManager.getCartPopulated(req.params.cid);
  if (!cart) return res.status(404).send("Not found");
  res.render("cart", { cart });
});

module.exports = router;
