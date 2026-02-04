async function cargarOrdenes() {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "https://backend-eternum-production.up.railway.app/api/ordenes",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );

  const json = await res.json();
  console.log("Ordenes:", json);

  if (!json.ok) {
    alert("Sesión vencida. Volvé a iniciar sesión.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }

  const tbody = document.getElementById("tabla-ordenes");
  tbody.innerHTML = "";

  json.data.forEach((o) => {
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
  const token = localStorage.getItem("token");

  const res = await fetch(
    `https://backend-eternum-production.up.railway.app/api/ordenes/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ estado }),
    },
  );

  const data = await res.json();

  if (!data.ok) {
    return;
  }
  const tr = select.closest("tr");
  if (estado === "pagado") {
    tr.classList.add("orden-pagada");
  }
  if (estado === "entregado") {
    borrarOrden(id);
  }
}

window.actualizarEstado = actualizarEstado;
window.borrarOrden = borrarOrden;

async function cargarProductos() {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "https://backend-eternum-production.up.railway.app/api/productos",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );

  const json = await res.json();
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";

  json.data.forEach((p) => {
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
    <img src="https://backend-eternum-production.up.railway.app/uploads/${p.imagen}" style="height:60px;border-radius:8px;">
    </td>
    <td>
    <button onclick="editarProducto(${p.id}, this)">Editar</button>
    <button onclick="borrarProducto(${p.id})">Borrar</button>
    </td>
    `;

    tbody.appendChild(tr);
  });
}

async function editarProducto(id, btn) {
  const tr = btn.parentElement.parentElement;
  const inputs = tr.querySelectorAll("input");
  const [nombre, material, tipo, precio, stock, descripcion] = [...inputs].map(
    (i) => i.value,
  );

  await fetch(
    `https://backend-eternum-production.up.railway.app/api/productos/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        material,
        tipo,
        precio,
        stock,
        descripcion,
      }),
    },
  );
  alert("Producto actualizado");
  cargarProductos();
}

async function borrarProducto(id) {
  if (!confirm("Borrar producto?")) return;
  await fetch(
    `https://backend-eternum-production.up.railway.app/api/productos/${id}`,
    {
      method: "DELETE",
    },
  );
  alert("Producto borrado");
  cargarProductos();
}

document
  .getElementById("form-agregar")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form); // 👈 importante

    const res = await fetch(
      "https://backend-eternum-production.up.railway.app/api/productos",
      {
        method: "POST",
        body: data, // 👈 sin headers
      },
    );

    const json = await res.json();

    if (json.ok) {
      alert("Producto agregado ✔️");
      form.reset();
      cargarProductos();
    } else {
      alert("Error al agregar producto");
    }
  });

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
  if (!confirm("Eliminar orden entregada?")) return;
  await fetch(
    `https://backend-eternum-production.up.railway.app/api/ordenes/${id}`,
    { method: "DELETE" },
  );
  alert("Orden eliminada");
  cargarOrdenes();
}
