




const fs = require("fs");
const path = require("path");

class CartManager {
  constructor() {
    this.path = path.join(__dirname, "../data/carts.json");
  }

  async _readFile() {
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async _writeFile(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();

    const newId = carts.length === 0 ? 1 : Math.max(...carts.map(c => Number(c.id))) + 1;
    const newCart = { id: newId, products: [] };

    carts.push(newCart);
    await this._writeFile(carts);

    return newCart;
  }

  async getCartById(cid) {
    const carts = await this._readFile();
    return carts.find((c) => String(c.id) === String(cid));
  }

  async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const cartIndex = carts.findIndex((c) => String(c.id) === String(cid));
    if (cartIndex === -1) return { error: "Not found" };

    const cart = carts[cartIndex];

    const prodIndex = cart.products.findIndex((p) => String(p.product) === String(pid));

    if (prodIndex === -1) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      cart.products[prodIndex].quantity += 1;
    }

    carts[cartIndex] = cart;
    await this._writeFile(carts);

    return cart;
  }
}

module.exports = CartManager;