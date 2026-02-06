



const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../data/products.json");
  }

  async _readFile() {
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async _writeFile(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(pid) {
    const products = await this._readFile();
    return products.find((p) => String(p.id) === String(pid));
  }

  async addProduct(product) {
    const products = await this._readFile();

    const required = ["title", "description", "code", "price", "status", "stock", "category", "thumbnails"];
    const missing = required.some((f) => product[f] === undefined);
    if (missing) return { error: "Campos incompletos" };

    const codeExists = products.some((p) => p.code === product.code);
    if (codeExists) return { error: "El code ya existe" };

    const newId =
      products.length === 0 ? 1 : Math.max(...products.map((p) => Number(p.id))) + 1;

    const newProduct = { id: newId, ...product };
    products.push(newProduct);

    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(pid, updates) {
    const products = await this._readFile();
    const index = products.findIndex((p) => String(p.id) === String(pid));
    if (index === -1) return { error: "Not found" };

    const { id, ...rest } = updates;
    products[index] = { ...products[index], ...rest };

    await this._writeFile(products);
    return products[index];
  }

  async deleteProduct(pid) {
    const products = await this._readFile();
    const index = products.findIndex((p) => String(p.id) === String(pid));
    if (index === -1) return { error: "Not found" };

    const deleted = products.splice(index, 1)[0];
    await this._writeFile(products);
    return deleted;
  }
}

module.exports = ProductManager;