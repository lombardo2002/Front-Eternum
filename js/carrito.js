function agregarAlCarrito(idProducto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const existente = carrito.find((p) => Number(p.id) === Number(idProducto));
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
  const contenedor = document.getElementById("carrito-container");
  const totalTexto = document.getElementById("total");

  // Traer productos desde backend
  let productos = [];
  try {
    const res = await fetch("https://backend-eternum-production.up.railway.app/api/productos");
    const json = await res.json();
    productos = json.data;
  } catch (e) {
    console.error("Error cargando productos:", e);
    alert("No se pudieron cargar los productos del servidor.");
    return;
  }

  function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  }

  function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function renderCarrito() {
    const carrito = obtenerCarrito();
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
      contenedor.innerHTML = "<p>El carrito está vacío.</p>";
      totalTexto.textContent = "";
      return;
    }

    let total = 0;

    carrito.forEach(itemCarrito => {
      const producto = productos.find(p => Number(p.id) === Number(itemCarrito.id));
      if (!producto) return;

      total += producto.precio * itemCarrito.cantidad;

      const div = document.createElement("div");
      div.classList.add("carrito-item");
      div.dataset.id = producto.id;

      div.innerHTML = `
        <img src="https://backend-eternum-production.up.railway.app/uploads/${producto.imagen}" class="img-item" alt="${producto.nombre}">
        <div class="info">
          <div class="texto">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio}</p>
          </div>
          <button class="btn eliminar">🗑️</button>
        </div>
      `;

      contenedor.appendChild(div);
    });

    totalTexto.textContent = "TOTAL: $" + total;

    // Botones eliminar por producto
    document.querySelectorAll(".btn.eliminar").forEach(btn => {
      btn.addEventListener("click", e => {
        const itemDiv = e.target.closest(".carrito-item");
        const id = Number(itemDiv.dataset.id);
        let carrito = obtenerCarrito();
        carrito = carrito.filter(p => Number(p.id) !== id);
        guardarCarrito(carrito);
        renderCarrito();
      });
    });
  }

  // Vaciar carrito
  document.getElementById("vaciar-carrito").addEventListener("click", () => {
    localStorage.removeItem("carrito");
    renderCarrito();
  });

  renderCarrito();
});
