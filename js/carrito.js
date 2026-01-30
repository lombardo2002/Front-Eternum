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
  if (span) {
    span.textContent = total;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Traer productos desde el backend
  let productos = [];
  try {
    const respuesta = await fetch("https://backend-eternum-production.up.railway.app/api/productos");
    const json = await respuesta.json();
    productos = json.data; // viene con { meta, data }
  } catch (error) {
    console.error("Error cargando productos del backend:", error);
    alert("No se pudieron cargar los productos desde el servidor.");
    return;
  }

  // -------------- Carrito ------------------

  function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  }

  function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  let carrito = obtenerCarrito();

  const contenedor = document.getElementById("carrito-container");
  const totalTexto = document.getElementById("total");

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío.</p>";
    totalTexto.textContent = "";
  }

  function actualizarTotal() {
    let total = carrito.reduce((acc, item) => {
      const prod = productos.find((p) => Number(p.id) === Number(item.id));
      if (!prod) return acc;
      return acc + prod.precio * item.cantidad;
    }, 0);

    totalTexto.textContent = "TOTAL: $" + total;
  }

  function renderCarrito() {
    contenedor.innerHTML = "";

    carrito.forEach((itemCarrito) => {
      const producto = productos.find(
        (p) => Number(p.id) === Number(itemCarrito.id),
      );
      if (!producto) return;

      const div = document.createElement("div");
      div.classList.add("carrito-item");

      div.innerHTML = `
                <img src="https://backend-eternum-production.up.railway.app/uploads/${producto.imagen}" class="img-item">

                <div class="info">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${producto.precio}</p>

                    <div class="cantidad-box">
                    <span>Cantidad: 1</span>
                    </div>
                    <!-- 
                    FUTURO:
                    <div class="cantidad-box">
                    <button class="btn-cantidad" data-id="${producto.id}" data-op="restar">–</button>
                    <span>${itemCarrito.cantidad}</span>
                    <button class="btn-cantidad" data-id="${producto.id}" data-op="sumar">+</button>
                    </div>
                    -->
                    <p class="subtotal">Subtotal: $${
                      producto.precio * itemCarrito.cantidad
                    }</p>
                </div>
            `;

      contenedor.appendChild(div);
    });

    actualizarTotal();
  }
/*
  contenedor.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-cantidad")) return;

    const id = parseInt(e.target.dataset.id);
    const operacion = e.target.dataset.op;

    const item = carrito.find((p) => Number(p.id) === Number(id));

    if (operacion === "sumar") {
      item.cantidad++;
    } else if (operacion === "restar" && item.cantidad > 1) {
      item.cantidad--;
    }

    guardarCarrito(carrito);
    renderCarrito();
  });
*/
  renderCarrito();

  const btnVaciar = document.getElementById("vaciar-carrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      localStorage.removeItem("carrito");
      window.location.reload();
    });
  }

  const btnFinalizar = document.getElementById("finalizar");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      if (!usuario) {
        const seguir = confirm(
          "Podés comprar sin registrarte 😊\n\n" +
            "Pero si te registrás vas a tener promos, historial de pedidos y beneficios exclusivos 💖\n\n" +
            "¿Querés continuar sin cuenta?",
        );

        if (!seguir) {
          window.location.href = "login.html";
          return;
        }
      }

      window.location.href = "checkout.html";
    });
  }

  actualizarContadorCarrito();
});
