function agregarAlCarrito(idProducto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const existente = carrito.find(p => Number(p.id) === Number(idProducto));
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ id: idProducto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const span = document.getElementById("cart-count");
  if (span) span.textContent = total;
}

document.addEventListener("DOMContentLoaded", async () => {
  let productos = [];
  try {
    const respuesta = await fetch("https://backend-eternum-production.up.railway.app/api/productos");
    const json = await respuesta.json();
    productos = json.data;
  } catch (error) {
    console.error("Error cargando productos:", error);
    alert("No se pudieron cargar los productos del servidor.");
    return;
  }

  const contenedor = document.getElementById("carrito-container");
  const totalTexto = document.getElementById("total");

  const obtenerCarrito = () => JSON.parse(localStorage.getItem("carrito")) || [];
  const guardarCarrito = (carrito) => localStorage.setItem("carrito", JSON.stringify(carrito));

  let carrito = obtenerCarrito();

  function actualizarTotal() {
    const total = carrito.reduce((acc, item) => {
      const prod = productos.find(p => Number(p.id) === Number(item.id));
      if (!prod) return acc;
      return acc + prod.precio * item.cantidad;
    }, 0);
    totalTexto.textContent = "TOTAL: $" + total;
  }

  function renderCarrito() {
    contenedor.innerHTML = "";
    if (carrito.length === 0) {
      contenedor.innerHTML = "<p>El carrito está vacío.</p>";
      totalTexto.textContent = "";
      return;
    }

    carrito.forEach(itemCarrito => {
      const producto = productos.find(p => Number(p.id) === Number(itemCarrito.id));
      if (!producto) return;

      const div = document.createElement("div");
      div.classList.add("carrito-item");

      // Contenido HTML de cada producto
      div.innerHTML = `
        <img src="https://backend-eternum-production.up.railway.app/uploads/${producto.imagen}" class="img-item" alt="${producto.nombre}">
        <div class="info">
          <h3>${producto.nombre}</h3>
          <p class="precio">$${producto.precio}</p>
      `;

      contenedor.appendChild(div);
    });

    actualizarTotal();
  }

  /*/ Eventos para sumar/restar
  contenedor.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-cantidad")) return;

    const id = parseInt(e.target.dataset.id);
    const operacion = e.target.dataset.op;
    const item = carrito.find(p => Number(p.id) === Number(id));

    if (!item) return;

    if (operacion === "sumar") item.cantidad++;
    if (operacion === "restar" && item.cantidad > 1) item.cantidad--;

    guardarCarrito(carrito);
    renderCarrito();
    actualizarContadorCarrito();
  });
*/
  // Vaciar carrito
  document.getElementById("vaciar-carrito").addEventListener("click", () => {
    localStorage.removeItem("carrito");
    carrito = [];
    renderCarrito();
    actualizarContadorCarrito();
  });

  // Finalizar compra
  document.getElementById("finalizar").addEventListener("click", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
  });

  renderCarrito();
  actualizarContadorCarrito();
});
