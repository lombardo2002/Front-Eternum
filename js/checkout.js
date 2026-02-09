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
      const seleccionado = Array.from(form.entrega).find(r => r.checked)?.value;
      direccionBox.classList.toggle("hidden", seleccionado !== "Envío");
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.nombre || !data.telefono || !data.pago) {
      alert("Completá los datos obligatorios");
      return;
    }

    const carritoNormalizado = carrito.map(p => ({
      id: p.id,
      cantidad: p.cantidad || 1
    }));

    const { data: ordenData, error } = await supabaseClient
    .from("ordenes")
    .insert ([{
      carrito: carritoNormalizado,
      nombre: data.nombre,
      telefono: data.telefono,
      entrega: data.entrega,
      direccion: data.direccion || "",
      pago: data.pago,
      nota: data.nota || "",
      fecha: new Date().toISOString()
    }]);

    if (error){
      console.error(error);
      alert("No se pudo guardar la orden");
      return;
    }

    const resumen = carritoNormalizado
    .map(p => `• Producto ID ${p.id} x${p.cantidad}`)
    .join("\n");

    // Mensaje WhatsApp
    const idOrden = ordenData[0].id;
    let mensaje = `Hola! Hice un pedido 🛍️
n°: ${idOrden}
Nombre: ${data.nombre}
Tel: ${data.telefono}
Entrega: ${data.entrega}
Dirección: ${data.direccion || "—"}
Pago: ${data.pago}

Pedido:
${resumen}

Nota: ${data.nota || "—"}
`;

    const telefonoVendedor = "5491157542606";
    const url = `https://wa.me/${telefonoVendedor}?text=${encodeURIComponent(mensaje)}`;

    localStorage.removeItem("carrito");
    window.location.href = url;
  });
});
