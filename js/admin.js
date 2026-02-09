async function cargarOrdenes() {
  const { data: ordenes, error } = await supabaseClient
  .from("ordenes")
  .select("*")
  .order("fecha", { ascending: false});

  if (error) return console.error(error);

  const tbody = document.getElementById("tabla-ordenes");
  tbody.innerHTML = "";

  ordenes.forEach((o) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
  <td>${o.id}</td>
  <td>$${o.total}</td>
  <td>
    <select onchange="actualizarEstado(${o.id}, this)">
      <option value="pendiente" ${o.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
      <option value="pagado" ${o.estado === "pagado" ? "selected" : ""}>Pagado</option>
      <option value="entregado" ${o.estado === "entregado" ? "selected" : ""}>Entregado</option>
    </select>
  </td>
  <td>${new Date(o.fecha).toLocaleString()}</td>
  <td>
    <button onclick="borrarOrden(${o.id})">Eliminar</button>
  </td>
`;

    tbody.appendChild(tr);
  });
}

async function actualizarEstado(id, select) {
  const estado = select.value;
  
  const{ data, error } = await supabaseClient
  .from("ordenes")
  .update({ estado })
  .eq("id", id);

  if (error) return console.error(error);

  const tr = select.closest("tr");
  if (estado === "pagado") tr.classList.add("orden-pagada");
  if (estado === "entregado") borrarOrden(id);
}

window.actualizarEstado = actualizarEstado;
window.borrarOrden = borrarOrden;

async function cargarProductos() {
  const { data: productos, error } = await supabaseClient
  .from ("productos")
  .select("*");

  if (error) {
    console.error("Error al cargar productos", error);
    return;
  }

  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";

  productos.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${p.id}</td>
    <td><input value="${p.nombre}" /></td>
    <td><input value="${p.material}" /></td>
    <td><input value="${p.tipo}" /></td>
    <td><input type="number" value="${p.precio}" /></td>
    <td><input type="number" value="${p.stock}" /></td>
    <td><input value="${p.descripcion}" /></td>
    <td>
    <img src="${p.imagen}" style="height:60px;border-radius:8px;">
    </td>
    <td>
    <button onclick="editarProducto(${p.id}, this)">Editar</button>
    <button onclick="borrarProducto(${p.id})">Borrar</button>
    </td>
    `;

    tbody.appendChild(tr);
  });
}

async function editarProducto(id, tr) {
  const inputs = tr.querySelectorAll("input"); 
  const [nombre, material, tipo, precio, stock, descripcion] = [...inputs].map(
    (i) => i.value,
  );

  const { data, error } = await supabaseClient
  .from("productos")
  .update({
    nombre,
    material,
    tipo,
    precio: parseFloat(precio),
    stock: parseInt(stock),
    descripcion,
  })
  .eq("id", id);
  
  if (error) return console.error(error);
  alert("Producto actualizado");
  cargarProductos();
}

async function borrarProducto(id) {
  if (!confirm("Eliminar producto?")) return;

  const { data, error } = await supabaseClient
  .from("productos")
  .delete()
  .eq("id", id);

  if(error) return console.error(error);
  alert("Producto eliminado");
  cargarProductos();
}

async function agregarProducto(form) {
  const data = new FormData(form);
  const file = data.get("imagen");
  
  const { data: uploadData, error: uploadError } = await supabaseClient
  .storage
  .from("productos")
  .upload(`imagenes/${file.name}`, file);

  if (uploadError) return console.error(uploadError);

  const { publicUrl } =  supabaseClient
  .storage
  .from("productos")
  .getPublicUrl(`imagenes/${file.name}`);

  const { data: prodData, error: prodError } = await supabaseClient
  .from("productos")
  .insert([{
    nombre: data.get("nombre"),
    material: data.get("material"),
    tipo: data.get("tipo"),
    precio: parseFloat(data.get("precio")),
    stock: parseInt(data.get("stock")),
    descripcion: data.get("descripcion"),
    imagen: publicUrl,
  }]);

  if (prodError) return console.error(prodError);
  alert("Producto agregado");
  form.reset();
  cargarProductos();
}

document.addEventListener("DOMContentLoaded", () => {
  cargarOrdenes();
  cargarProductos();
});

const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario || usuario.rol !== "admin") {
  alert("Acceso solo para administradores");
  window.location.href = "login.html";
}

async function borrarOrden(id) {
  if (!confirm("Eliminar orden?")) return;

  const { data, error } = await supabaseClient
  .from("ordenes")
  .delete()
  .eq("id", id);

  if (error) return console.error(error);
  alert("Orden eliminada");
  cargarOrdenes();
}
