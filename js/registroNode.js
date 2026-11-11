const formularioRegistro = document.getElementById("form_registro");
const botonRegistro = document.getElementById("boton_registro");
const estadoRegistro = document.getElementById("estado_registro");

formularioRegistro.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  botonRegistro.disabled = true;
  estadoRegistro.textContent = "Registrando usuario...";

  const datosUsuario = {
    nombre: document.getElementById("nombre").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    password: document.getElementById("password").value,
    carrera: document.getElementById("carrera").value,
  };

  try {
    const respuesta = await fetch("http://localhost:3000/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosUsuario),
    });
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || "No fue posible registrar el usuario.");
    }

    formularioRegistro.reset();
    estadoRegistro.textContent = "Registro exitoso. Ya puedes iniciar sesión.";
  } catch (error) {
    estadoRegistro.textContent =
      error instanceof TypeError
        ? "No se pudo conectar con el servidor. Verifica que esté ejecutándose en http://localhost:3000."
        : error.message;
  } finally {
    botonRegistro.disabled = false;
  }
});
