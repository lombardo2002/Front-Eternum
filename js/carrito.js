import {supabaseClient } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("carrito-container");
  if (!contenedor) return;
  const totalTexto = document.getElementById("total");
  const btnVaciar = document.getElementById("vaciar-carrito");
  const btnFinalizar = document.getElementById("finalizar");


  const { data: productos, error } = await supabaseClient
  .from("productos")
  .select("*");

  if(error) {
    console.error(error);
    alert("No se pudieron cargar los productos");
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
      if (btnVaciar) btnVaciar.style.display = "none";
      if (btnFinalizar) btnFinalizar.style.display = "none";
      return;
    }

    let total = 0;

    carrito.forEach((itemCarrito) => {
      const producto = productos.find(
        (p) => Number(p.id) === Number(itemCarrito.id),
      );
      if (!producto) {
        console.warn("Producto no encontrado en backend:", itemCarrito);
        return;
      }

      const precio = Number(producto.precio);
      const cantidad = Number(itemCarrito.cantidad);

      if (isNaN(precio) || isNaN(cantidad)) {
        console.warn("Datos inválidos en carrito:", { producto, itemCarrito });
        return;
      }

      total += precio * cantidad;

      const div = document.createElement("div");
      div.classList.add("carrito-item");
      div.dataset.id = producto.id;

      div.innerHTML = `
        <img src="${producto.imagen}" class="img-item" alt="${producto.nombre}">
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

    totalTexto.textContent = "TOTAL: $" + total.toFixed(2);

    if (btnVaciar) btnVaciar.style.display = "inline-block";
    if (btnFinalizar) {
      if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {
          const carrito = obtenerCarrito();
          if (!carrito.length) {
            alert("El carrito está vacío");
            return;
          }
          // Redirigir al checkout
          window.location.href = "checkout.html";
        });
      }
    }

    // Botones eliminar por producto
    document.querySelectorAll(".btn.eliminar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemDiv = e.target.closest(".carrito-item");
        const id = Number(itemDiv.dataset.id);
        let carrito = obtenerCarrito();
        carrito = carrito.filter((p) => Number(p.id) !== id);
        guardarCarrito(carrito);
        renderCarrito();
        actualizarContadorCarrito();
      });
    });
  }

  function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const span = document.getElementById("cart-count");
    if (span) span.textContent = total;
  }

  window.actualizarContadorCarrito = actualizarContadorCarrito;

  function agregarAlCarrito(idProducto) {
    let carrito = obtenerCarrito();

    const existente = carrito.find((p) => Number(p.id) === Number(idProducto));
    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({ id: idProducto, cantidad: 1 });
    }

    guardarCarrito(carrito);
    actualizarContadorCarrito();
    renderCarrito();
  }

  window.agregarAlCarrito = agregarAlCarrito;

  // Vaciar carrito
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      localStorage.removeItem("carrito");
      renderCarrito();
      actualizarContadorCarrito();
    });
  }

  renderCarrito();
  actualizarContadorCarrito();
});
