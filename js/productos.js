document.addEventListener("DOMContentLoaded", () => {
  const titulo = document.getElementById("titulo-catalogo");

  const params = new URLSearchParams(window.location.search);
  const materialParam = params.get("material");
  const tipoParam = params.get("tipo");

  let url = "https://backend-eternum-production.up.railway.app/api/productos";
  const query = [];

  if (materialParam) query.push(`material=${materialParam}`);
  if (tipoParam) query.push(`tipo=${tipoParam}`);

  if (query.length) url += "?" + query.join("&");

  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      const productos = json.data;

      if (!materialParam && !tipoParam) {
        titulo.textContent = "Todos los productos ✨";
      } else {
        let t = "";
        if (materialParam) t += materialParam.toUpperCase() + " ";
        if (tipoParam)
          t += tipoParam.charAt(0).toUpperCase() + tipoParam.slice(1);
        titulo.textContent = t.trim();
      }

      mostrarProductos(productos);
    })
    .catch((err) => {
      console.error("Error cargando productos:", err);
      titulo.textContent = "Error cargando productos.";
    });
});

function mostrarProductos(lista) {
  const contenedor = document.getElementById("lista-productos");
  contenedor.innerHTML = "";

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = "<p>No hay productos disponibles 😢</p>";
    return;
  }

  lista.forEach((prod) => {
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

    const imagenPrincipal = imagenes.length ? imagenes[0] : "placeholder.png"; // o una imagen por defecto

    contenedor.innerHTML += `
      <div class="card-producto">
        <img src="https://backend-eternum-production.up.railway.app/uploads/${imagenPrincipal}" 
             alt="${prod.nombre}"
             onclick="location.href='producto.html?id=${prod.id}'">

        <h3 onclick="location.href='producto.html?id=${prod.id}'">
          ${prod.nombre}
        </h3>

        <p class="desc">${prod.descripcion}</p>
        <p class="precio">$${prod.precio}</p>

        <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
      </div>
    `;
  });
}
