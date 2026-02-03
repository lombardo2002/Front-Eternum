document.addEventListener("DOMContentLoaded", async () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (!carrito.length) {
    alert("El carrito está vacío");
    location.href = "index.html";
    return;
  }

  const form = document.getElementById("form-checkout");
  const direccionBox = document.getElementById("direccion-box");

  form.entrega.forEach((radio) => {
    radio.addEventListener("change", () => {
      direccionBox.classList.toggle("hidden", form.entrega.value !== "Envío");
    });
  });

  form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  if (!data.nombre || !data.telefono || !data.pago) {
    alert("Completá los datos obligatorios");
    return;
  }

  // 👉 Guardar orden en backend
  const token = localStorage.getItem("token");

  const res = await fetch("https://backend-eternum-production.up.railway.app/api/ordenes/crear", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: "Bearer " + token }),
    },
    body: JSON.stringify({ carrito }),
  });

  const result = await res.json();

  if (!result.ok) {
    alert("❌ No se pudo guardar la orden");
    return;
  }

  // 👉 Mensaje WhatsApp
  let resumen = carrito
    .map((p) => `• Producto ID ${p.id} x${p.cantidad}`)
    .join("\n");

  let mensaje = `Hola! Hice un pedido 🛍️

Nombre: ${data.nombre}
Tel: ${data.telefono}
Entrega: ${data.entrega}
Dirección: ${data.direccion || "—"}
Pago: ${data.pago}

Pedido:
${resumen}

Nota: ${data.nota || "—"}
`;

  const telefonoTuyo = "5491157542606";
  const url = `https://wa.me/${telefonoTuyo}?text=${encodeURIComponent(mensaje)}`;

  localStorage.removeItem("carrito");
  window.location.href = url;
});

});
