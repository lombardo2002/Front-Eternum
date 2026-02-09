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

async function agregarAlCarritoBackend(idProducto, idUsuario) {
  try {
    const { data, error } = await supabaseClient.from("carrito").insert([
      {
        id_usuario: idUsuario,
        id_producto: idProducto,
        cantidad: 1,
      },
    ]);
    if (error) {
      console.error("Error al agregar al carrito", error);
    } else {
      console.log("Agregado al carrito:", data);
    }
  } catch (err) {
    console.error("Error inesperado:", err);
  }
}

async function cargarCarrito(idUsuario) {
  const { data, error } = await supabaseClient
    .from("carrito")
    .select("*")
    .eq("id_usuario", idUsuario);

  if (error) {
    console.error("Error al cargar carrito", error);
    return;
  }
  const total = data.reduce((acc, item) => acc + item.cantidad, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = total;
}

const ID_USUARIO_FAKE = 1;

document.addEventListener("DOMContentLoaded", async () => {
  let productos = [];

  const { data, error } = await supabaseClient.from("productos").select("*");

  if (error) {
    console.error("Error al cargar productos", error);
    return;
  }

  productos = data;

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
    agregarAlCarritoBackend(id, ID_USUARIO_FAKE);
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
  cargarCarrito(ID_USUARIO_FAKE);
});

async function cargarDestacados() {
  const { data, error } = await supabaseClient
    .from("productos")
    .select("*")
    .eq("destacado", true);

  if (error) {
    console.error("Error cargando destacados", error);
    return;
  }

  const cont = document.getElementById("destacados-container");
  cont.innerHTML = data
    .map(
      (p) => ` 
      <div class="producto destacado">
        <img src="${p.imagen}" 
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
}

// ---------------------- PRUEBA FRONT → BACK ---------------------- //

async function testSupabase() {
  const { data, error } = await supabaseClient.from("test").select("*");
  console.log("DATA:", data);
  console.log("ERROR:", error);
}

testSupabase();
