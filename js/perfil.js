const botonUsuario = document.getElementById("boton_usuario");
const panelPerfil = document.getElementById("panel_perfil");
const formulario = document.getElementById("form_perfil");
const mensaje = document.getElementById("estado_perfil");
const botonEliminar = document.getElementById("boton_eliminar_usuario");

let usuario = JSON.parse(localStorage.getItem("token") || "null");

if (usuario && usuario.id) {
  botonUsuario.hidden = false;
  botonUsuario.textContent = `Mi usuario: ${usuario.firstName}`;
}

botonUsuario.addEventListener("click", function () {
  formulario.elements.firstName.value = usuario.firstName || "";
  formulario.elements.lastName.value = usuario.lastName || "";
  formulario.elements.password.value = "";
  panelPerfil.hidden = false;
});

document.getElementById("cerrar_perfil").addEventListener("click", function () {
  panelPerfil.hidden = true;
});

document.getElementById("cancelar_perfil").addEventListener("click", function () {
  panelPerfil.hidden = true;
});

document.getElementById("boton_cerrar_sesion").addEventListener("click", function () {
  localStorage.removeItem("token");
  usuario = null;
  botonUsuario.hidden = true;
  panelPerfil.hidden = true;
});

botonEliminar.addEventListener("click", async function () {
  if (!confirm("¿Seguro que quieres eliminar este usuario?")) {
    return;
  }

  botonEliminar.disabled = true;
  mensaje.textContent = "Eliminando usuario...";

  try {
    const respuesta = await fetch(`https://dummyjson.com/users/${usuario.id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo eliminar el usuario.");
    }

    localStorage.removeItem("token");
    usuario = null;
    botonUsuario.hidden = true;
    panelPerfil.hidden = true;
    alert("Usuario eliminado y sesión cerrada.");
  } catch (error) {
    mensaje.textContent = error.message;
    botonEliminar.disabled = false;
  }
});

formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const cambios = {
    firstName: formulario.elements.firstName.value,
    lastName: formulario.elements.lastName.value,
    password: formulario.elements.password.value,
  };

  try {
    const respuesta = await fetch(`https://dummyjson.com/users/${usuario.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cambios),
    });

    if (!respuesta.ok) {
      throw new Error("No se pudieron guardar los cambios.");
    }

    usuario = { ...usuario, ...cambios };
    localStorage.setItem("token", JSON.stringify(usuario));
    botonUsuario.textContent = `Mi usuario: ${usuario.firstName}`;
    mensaje.textContent = "Cambios guardados.";
  } catch (error) {
    mensaje.textContent = error.message;
  }
});
