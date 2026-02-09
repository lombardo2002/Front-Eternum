import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error al iniciar sesión" + error.message);
      return;
    }

    const user = data.user;

    const { data: perfil, error: perfilError } = await supabase
      .from("usuarios")
      .select("rol")
      .eq("id", user.id)
      .single();

    if (perfilError) {
      alert("Error al obtener perfil");
      return;
    }

    // Guardar sesión
    localStorage.setItem("usuario", JSON.stringify(user));
    localStorage.setItem("rol", perfil.rol);

    // Solo admin entra al panel
    if (data.usuario.rol === "admin") {
      window.location.href = "admin.html";
    } else {
      alert("Acceso solo para administradores");
      window.location.href = "index.html";
    }
  });
});
