function agregarAlCarrito(idProducto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Verificamos si el producto ya está
  const existente = carrito.find((item) => item.id === idProducto);

  if (existente) {
    return; // 🚫 No hacemos nada más
  }

  // Si no estaba, lo agregamos
  carrito.push({
    id: idProducto,
    cantidad: 1, // siempre 1
  });

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}


function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = total;
}

async function agregarAlCarritoBackend(id) {
  try {
    const res = await fetch("https://backend-eternum-production.up.railway.app/api/carrito", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        cantidad: 1,
      }),
    });

    const data = await res.json();

    if (data.ok) {
      //      cargarCarrito();
    }
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
  }
}

async function cargarCarrito() {
  try {
    const res = await fetch("https://backend-eternum-production.up.railway.app/api/carrito");
    const data = await res.json();

    if (data.ok) {
      const total = data.carrito.reduce((acc, p) => acc + p.cantidad, 0);
      const cartCount = document.getElementById("cart-count");
      if (cartCount) cartCount.textContent = total;
    }
  } catch (error) {
    console.error("Error cargando carrito:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let productos = [];

  try {
    const resp = await fetch("https://backend-eternum-production.up.railway.app/api/productos");
    const data = await resp.json();
    productos = data.data;
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }

  const contenedor = document.getElementById("productos-container");

  if (contenedor) {
    contenedor.innerHTML = productos
      .map(
        (p) => `
            <div class="producto">
                <img src="${p.imagen}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p>$${p.precio}</p>
                <button class="add-to-cart" data-id="${p.id}">Agregar al carrito</button>
            </div>
        `,
      )
      .join("");
  }

  /* ---------------------------- CARRITO ---------------------------- */

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");

    if (!btn) return;

    const id = parseInt(btn.dataset.id);
    if (!id) return;

    agregarAlCarrito(id);
  });

  /* ---------------------------- CARRUSEL ---------------------------- */

  const slides = document.querySelectorAll(".carousel-item");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  let index = 0;

  function mostrarSlide(n) {
    slides.forEach((s) => s.classList.remove("active"));
    slides[n].classList.add("active");
  }

  if (slides.length > 0) {
    nextBtn.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      mostrarSlide(index);
    });

    prevBtn.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      mostrarSlide(index);
    });

    // AUTO-SLIDE cada 3 segundos
    setInterval(() => {
      index = (index + 1) % slides.length;
      mostrarSlide(index);
    }, 3000);
  }

  cargarDestacados();
});

cargarCarrito();

async function cargarDestacados() {
  try {
    const res = await fetch(
      "https://backend-eternum-production.up.railway.app/api/productos?destacado=true",
    );
    const data = await res.json();

    const cont = document.getElementById("destacados-container");
    cont.innerHTML = data.data
      .map(
        (p) => ` 
      <div class="producto destacado">
        <img src="https://backend-eternum-production.up.railway.app/uploads/${p.imagen}" 
             alt="${p.nombre}"
             onclick="location.href='producto.html?id=${p.id}'">

        <h3 onclick="location.href='producto.html?id=${p.id}'">
          ${p.nombre}
        </h3>

        <p>$${p.precio}</p>

        <button class="add-to-cart" data-id="${p.id}">Agregar al carrito</button>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    console.error("Error cargando destacados:", error);
  }
}

// ---------------------- PRUEBA FRONT → BACK ---------------------- //
fetch("https://backend-eternum-production.up.railway.app/")
  .then((res) => res.text())
  .then((data) => {
    console.log("Respuesta del backend:", data);
  })
  .catch((err) => {
    console.error("Error al conectar con backend:", err);
  });
