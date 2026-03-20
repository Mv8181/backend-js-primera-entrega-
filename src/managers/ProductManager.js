



const ProductModel = require("../models/product.model");

class ProductManager {
  async getProductsPaginated({ limit = 10, page = 1, sort, query }) {
    const filter = {};

    // query: category o disponibilidad (status)
    // - si query es "true/false" => status
    // - si no => category
    if (query !== undefined) {
      if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    const options = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      lean: true
    };

    // sort asc/desc por precio
    if (sort === "asc") options.sort = { price: 1 };
    if (sort === "desc") options.sort = { price: -1 };

    return await ProductModel.paginate(filter, options);
  }

  async getProducts() {
    return await ProductModel.find().lean();
  }

  async getProductById(pid) {
    return await ProductModel.findById(pid).lean();
  }

  async addProduct(product) {
    try {
      const created = await ProductModel.create(product);
      return created.toObject();
    } catch (err) {
      return { error: err.message };
    }
  }

  async updateProduct(pid, updates) {
    const { id, _id, ...rest } = updates; // no permitir ids
    const updated = await ProductModel.findByIdAndUpdate(pid, rest, { new: true }).lean();
    if (!updated) return { error: "Not found" };
    return updated;
  }

  async deleteProduct(pid) {
    const deleted = await ProductModel.findByIdAndDelete(pid).lean();
    if (!deleted) return { error: "Not found" };
    return deleted;
  }
}

module.exports = ProductManager;

