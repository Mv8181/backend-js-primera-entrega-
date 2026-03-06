
console.log("realTime.js cargado");

const socket = io();

socket.on("connect", () => {
  console.log("Socket conectado", socket.id);
});

const list = document.getElementById("productsList");
const addForm = document.getElementById("addForm");
const deleteForm = document.getElementById("deleteForm");

function renderProducts(products) {
  list.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price} (ID: ${p.id})`;
    list.appendChild(li);
  });
}


socket.emit("getProducts");


socket.on("productsUpdated", (products) => {
  console.log("productsUpdated recibido:", products);
  renderProducts(products);
});

// agregar producto
addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(addForm);
  const thumbnailsRaw = formData.get("thumbnails");
  const thumbnails = thumbnailsRaw.split(",").map((t) => t.trim());

  const product = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    status: addForm.status.checked,
    stock: Number(formData.get("stock")),
    category: formData.get("category"),
    thumbnails
  };

  socket.emit("addProduct", product);
  addForm.reset();
});

// eliminar producto
deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(deleteForm);
  const pid = formData.get("pid");

  socket.emit("deleteProduct", pid);
  deleteForm.reset();
});