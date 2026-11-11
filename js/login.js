const botonUsuarios = document.getElementById("boton_usuarios");
const panelUsuarios = document.getElementById("panel_usuarios");
const estadoUsuarios = document.getElementById("estado_usuarios");
const listaUsuarios = document.getElementById("lista_usuarios");
let usuariosCargados = false;

botonUsuarios.addEventListener("click", async function () {
  const estaVisible = !panelUsuarios.hidden;
  panelUsuarios.hidden = estaVisible;
  botonUsuarios.setAttribute("aria-expanded", String(!estaVisible));

  if (estaVisible || usuariosCargados) {
    return;
  }

  botonUsuarios.disabled = true;
  estadoUsuarios.textContent = "Cargando usuarios...";

  try {
    const respuesta = await fetch("https://dummyjson.com/users?limit=0");
    const datos = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error(datos.message || "No fue posible consultar los usuarios.");
    }
    if (!Array.isArray(datos.users)) {
      throw new Error("La respuesta de usuarios no tiene el formato esperado.");
    }

    datos.users.forEach(function (usuario) {
      const elemento = document.createElement("li");
      elemento.textContent = `${usuario.firstName} ${usuario.lastName} — ${usuario.username} (${usuario.email}) - ${usuario.password}`;
      listaUsuarios.appendChild(elemento);
    });

    usuariosCargados = true;
    estadoUsuarios.textContent = `Se encontraron ${datos.users.length} usuarios.`;
  } catch (error) {
    estadoUsuarios.textContent = `Error al consultar usuarios: ${error.message}`;
  } finally {
    botonUsuarios.disabled = false;
  }
});
