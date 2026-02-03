document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(
        "https://backend-eternum-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al iniciar sesión");
        return;
      }

      // Guardar sesión
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Solo admin entra al panel
      if (data.usuario.rol === "admin") {
        window.location.href = "admin.html";
      } else {
        alert("Acceso solo para administradores");
        window.location.href = "index.html";
      }

    } catch (error) {
      console.error("Error login:", error);
      alert("Error de conexión con el servidor");
    }
  });
});
