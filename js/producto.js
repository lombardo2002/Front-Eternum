document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("detalle-producto");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!contenedor) {
    console.error("No existe #detalle-producto");
    return;
  }

  if (!id) {
    contenedor.innerHTML = "<p>ID de producto no encontrado.</p>";
    return;
  }

  try {
    const res = await fetch(
      `https://backend-eternum-production.up.railway.app/api/productos/${id}`,
    );
    const json = await res.json();
    const prod = json.data || json; // por si viene envuelto en { data }

    let imagenes = [];

    if (prod.imagenes) {
      try {
        imagenes = JSON.parse(prod.imagenes);
      } catch {
        imagenes = [];
      }
    }

    if (!imagenes.length && prod.imagen) {
      imagenes = [prod.imagen];
    }

    const imagenPrincipal = imagenes[0] || "placeholder.png";

    const thumbs = imagenes
      .map(
        (img) => `
        <img src="https://backend-eternum-production.up.railway.app/uploads/${img}"
             class="thumb"
             alt="${prod.nombre}">
      `,
      )
      .join("");

    contenedor.innerHTML = `
      <div class="producto-layout">
        <div class="galeria">
          <img id="img-principal"
               src="https://backend-eternum-production.up.railway.app/uploads/${imagenPrincipal}"
               class="img-grande">

          <div class="thumbs">${thumbs}</div>
        </div>

        <div class="info">
          <h1>${prod.nombre}</h1>
          <p class="desc">${prod.descripcion || ""}</p>
          <p class="precio">$${prod.precio}</p>

          <button class="btn" id="btn-carrito">Agregar al carrito</button>
          <a href="productos.html" class="volver">← Volver</a>
        </div>
      </div>
    `;

    // 👉 Eventos de las miniaturas
    document.querySelectorAll(".thumb").forEach((img) => {
      img.addEventListener("click", () => {
        document.getElementById("img-principal").src = img.src;
      });
    });

    // 👉 Botón carrito
    const btn = document.getElementById("btn-carrito");
    if (btn && window.agregarAlCarrito) {
      btn.addEventListener("click", () => agregarAlCarrito(prod.id));
    }
  } catch (error) {
    console.error("Error al cargar producto:", error);
    contenedor.innerHTML = "<p>Error al cargar el producto 😢</p>";
  }
});
