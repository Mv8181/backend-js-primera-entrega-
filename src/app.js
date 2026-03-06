




const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

const ProductManager = require("./managers/ProductManager");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public")));


app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});


const io = new Server(httpServer);


const productManager = new ProductManager();


io.on("connection", (socket) => {
  // Enviar lista inicial cuando el cliente la pida
  socket.on("getProducts", async () => {
    const products = await productManager.getProducts();
    socket.emit("productsUpdated", products);
  });

  
  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);
    const products = await productManager.getProducts();
    io.emit("productsUpdated", products);
  });

  
  socket.on("deleteProduct", async (pid) => {
    await productManager.deleteProduct(pid);
    const products = await productManager.getProducts();
    io.emit("productsUpdated", products);
  });
});
