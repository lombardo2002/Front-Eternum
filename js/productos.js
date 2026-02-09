document.addEventListener("DOMContentLoaded", async () => {
  const titulo = document.getElementById("titulo-catalogo");

  const params = new URLSearchParams(window.location.search);
  const materialParam = params.get("material");
  const tipoParam = params.get("tipo");

  let query = supabaseClient.from("productos").select("*");

  if (materialParam) query.push("material", materialParam);
  if (tipoParam) query.eq("tipo", tipoParam);

  const { data: productos, error } = await query;

  if (error) {
    console.error("Error cargano productos:", error);
    titulo.textContent = "Error cargando productos.";
    return;
  }

  if (!materialParam && !tipoParam) {
    titulo.textContent = "Todos los productos ✨";
  } else {
    let t = "";
    if (materialParam) t += materialParam.toUpperCase() + " ";
    if (tipoParam) t += tipoParam.charAt(0).toUpperCase() + tipoParam.slice(1);
    titulo.textContent = t.trim();
  }

  mostrarProductos(productos);
});

function agregarAlCarrito(idProducto, nombreProducto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Verificamos si el producto ya está
  const existente = carrito.find((item) => item.id === idProducto);

  if (existente) {
    alert(
      "Este producto ya está en el carrito. Solo hay 1 unidad disponible.",
    );
    return;
  }

  // Si no estaba, se agrega
  carrito.push({
    id: idProducto,
    nombre: nombreProducto,
    cantidad: 1,
  });

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function mostrarProductos(lista) {
  const contenedor = document.getElementById("lista-productos");
  contenedor.innerHTML = "";

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = "<p>No hay productos disponibles 😢</p>";
    return;
  }

  lista.forEach((prod) => {
    const imagenPrincipal = prod.imagen || "placeholder.png";

    const card = document.createElement("div");
    card.classList.add("card-producto");
    card.innerHTML = `
      <img src="${imagenPrincipal}" 
           alt="${prod.nombre}"
           onclick="location.href='producto.html?id=${prod.id}'">

      <h3 onclick="location.href='producto.html?id=${prod.id}'">${prod.nombre}</h3>

      <p class="desc">${prod.desripcion || ""}</p>
      <p class="precio">$${prod.precio}</p>

      <button class="add-to-cart" data-id="${prod.id}">Agregar al carrito</button>
    `;

    contenedor.appendChild(card);
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      const btn = e.target;
      const card = btn.closest(".card-producto");

      const id = Number(btn.dataset.id);
      const nombre = card.querySelector("h3").textContent;

      agregarAlCarrito(id, nombre);
    }
  });
}
