document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("https://backend-eternum-production.up.railway.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al registrarse");
        return;
      }

      alert("Cuenta creada con éxito 🎉 Ahora podés iniciar sesión");
      window.location.href = "login.html";

    } catch (err) {
      console.error("Error registro:", err);
      alert("Error de conexión con el servidor");
    }
  });
});
