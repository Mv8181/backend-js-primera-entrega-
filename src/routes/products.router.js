

const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const manager = new ProductManager();

// GET /api/products?limit&page&sort&query
router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    const result = await manager.getProductsPaginated({
      limit,
      page,
      sort,
      query
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    const makeLink = (p) => {
      if (!p) return null;
      const params = new URLSearchParams();
      params.set("page", p);
      params.set("limit", limit || 10);
      if (sort) params.set("sort", sort);
      if (query) params.set("query", query);
      return `${baseUrl}?${params.toString()}`;
    };

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: makeLink(result.prevPage),
      nextLink: makeLink(result.nextPage)
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const result = await manager.addProduct(req.body);
    if (result.error) return res.status(400).json(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  try {
    const result = await manager.updateProduct(req.params.pid, req.body);
    if (result.error) return res.status(404).json(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const result = await manager.deleteProduct(req.params.pid);
    if (result.error) return res.status(404).json(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;