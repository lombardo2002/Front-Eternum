// Cargar el header automaticamente en cada página
document.addEventListener("DOMContentLoaded", () => {

  const headerEl = document.getElementById("header");
  if (headerEl) {
    fetch("/partials/header.html")
      .then(res => res.text())
      .then(html => {
        headerEl.innerHTML = html;

        // Cuando el header ya está en el DOM
        activarMenu();

        if(typeof window.actualizarContadorCarrito === "function"){
          window.actualizarContadorCarrito();
        }
      });
  }

  const footerEl = document.getElementById("footer");
  if (footerEl) {
    fetch("./partials/footer.html")
      .then(res => res.text())
      .then(html => {
        footerEl.innerHTML = html;
      });
  }

  function activarMenu() {
    const dropdown = document.getElementById("productosDropdown");
    const btn = dropdown?.querySelector(".drop-btn");

    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.classList.toggle("open");
      });
    }

    document.querySelectorAll(".sub-drop-btn").forEach((boton) => {
      boton.addEventListener("click", (e) => {
        e.preventDefault();
        boton.parentElement.classList.toggle("open");
      });
    });
  }

});
