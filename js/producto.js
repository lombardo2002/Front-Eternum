document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("detalle-producto");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    contenedor.innerHTML = "<p>ID de producto no encontrado.</p>";
    return;
  }

  fetch(`https://backend-eternum-production.up.railway.app/api/productos/${id}`)
    .then(res => res.json())
    .then(prod => {
      const imagenes = JSON.parse(prod.imagenes || []);

      const thumbs = imagenes.map(img => 
         `
  <img src="https://backend-eternum-production.up.railway.app/uploads/${img}" 
       class="thumb" 
       onclick="document.getElementById('img-principal').src='https://backend-eternum-production.up.railway.app/uploads/${img}'">
`
      ).join("");

      contenedor.innerHTML = `
        <div class="producto-layout">
          <div class="galeria">
            <img id="img-principal" 
                 src="https://backend-eternum-production.up.railway.app/uploads/${imagenes[0]}" 
                 class="img-grande">

            <div class="thumbs">${thumbs}</div>
          </div>

          <div class="info">
            <h1>${prod.nombre}</h1>
            <p class="desc">${prod.descripcion}</p>
            <p class="precio">$${prod.precio}</p>

            <button class="btn" onclick="agregarAlCarrito(${prod.id})">
              Agregar al carrito
            </button>

            <a href="productos.html" class="volver">← Volver</a>
          </div>
        </div>
      `;

      document.querySelectorAll(".thumb").forEach(img => {
        img.addEventListener("click", () => {
          document.getElementById("img-principal").src = img.src;
        });
      });
    })
    .catch(() => {
      contenedor.innerHTML = "<p>Error al cargar el producto.</p>";
    });
});

