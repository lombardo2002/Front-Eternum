document.addEventListener("headerCargado", () => {
  // ------ Menú productos ------
  const productoDropdown = document.getElementById("productosDropdown");
  const productosBtn = productoDropdown.querySelector(".drop-btn");

  productosBtn.addEventListener("click", (e) => {
    e.preventDefault();
    productoDropdown.classList.toggle("open");
  });

  document.querySelectorAll(".sub-drop-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.parentElement.classList.toggle("open");
    });
  });

  document.addEventListener("click", (e) => {
    if (!productoDropdown.contains(e.target)) {
      productoDropdown.classList.remove("open");
      document
        .querySelectorAll(".sub-item.open")
        .forEach((i) => i.classList.remove("open"));
    }
  });

  // ------ Usuario ------
  const userArea = document.getElementById("user-area");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

 /* if (usuario) {
    userArea.innerHTML = `
      <span>Hola, ${usuario.nombre || usuario.email}</span>
      <button id="logout">Salir</button>
    `;

    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.reload();
    });
  } else {
    userArea.innerHTML = `<a href="login.html">Iniciar sesión</a>`;
  }*/
});
