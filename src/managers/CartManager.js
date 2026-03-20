




const CartModel = require("../models/cart.model");

class CartManager {
  async createCart() {
    const cart = await CartModel.create({ products: [] });
    return cart.toObject();
  }

  // normal (sin populate)
  async getCartById(cid) {
    return await CartModel.findById(cid).lean();
  }

  // con populate (lo pide la consigna)
  async getCartPopulated(cid) {
    return await CartModel.findById(cid).populate("products.product").lean();
  }

  async addProductToCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return { error: "Not found" };

    const idx = cart.products.findIndex((p) => String(p.product) === String(pid));

    if (idx === -1) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      cart.products[idx].quantity += 1;
    }

    await cart.save();
    return cart.toObject();
  }

  // DELETE /api/carts/:cid/products/:pid
  async deleteProductFromCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return { error: "Not found" };

    cart.products = cart.products.filter((p) => String(p.product) !== String(pid));
    await cart.save();
    return cart.toObject();
  }

  // PUT /api/carts/:cid  (reemplaza TODOS los productos)
  async updateCart(cid, productsArray) {
    const updated = await CartModel.findByIdAndUpdate(
      cid,
      { products: productsArray },
      { new: true }
    ).lean();

    if (!updated) return { error: "Not found" };
    return updated;
  }

  // PUT /api/carts/:cid/products/:pid  (solo quantity)
  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    if (!cart) return { error: "Not found" };

    const idx = cart.products.findIndex((p) => String(p.product) === String(pid));
    if (idx === -1) return { error: "Not found" };

    cart.products[idx].quantity = Number(quantity);
    await cart.save();
    return cart.toObject();
  }

  // DELETE /api/carts/:cid  (vaciar carrito)
  async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return { error: "Not found" };

    cart.products = [];
    await cart.save();
    return cart.toObject();
  }
}

module.exports =  CartManager;
