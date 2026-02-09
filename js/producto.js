import {supabaseClient } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("detalle-producto");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!contenedor) {
    console.error("No existe #detalle-producto");
    return;
  }

  if (!id) {
    console.error("No existe detalles del producto");
    return;
  }

  const { data: prod, error } = await supabaseClient
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !prod) {
    console.error("Error al cargar productos:", error);
    contenedor.innerHTML =
      "<p>Error al cargar producto, estamos trabajando para solucionarlo </p>";
    return;
  }

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
        <img src="${img}"
             class="thumb"
             alt="${prod.nombre}">
      `,
    )
    .join("");

  contenedor.innerHTML = `
      <div class="producto-layout">
        <div class="galeria">
          <img id="img-principal"
               src="${imagenPrincipal}"
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

  //Eventos de las miniaturas
  document.querySelectorAll(".thumb").forEach((img) => {
    img.addEventListener("click", () => {
      document.getElementById("img-principal").src = img.src;
    });
  });

  //Botón carrito
  const btn = document.getElementById("btn-carrito");
  if (btn && window.agregarAlCarrito) {
    btn.addEventListener("click", () => agregarAlCarrito(prod.id));
  }
});
