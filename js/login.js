const formularioLogin = document.getElementById("form_login");
const botonUsuarios = document.getElementById("boton_usuarios");
const panelUsuarios = document.getElementById("panel_usuarios");
const estadoUsuarios = document.getElementById("estado_usuarios");
const listaUsuarios = document.getElementById("lista_usuarios");
let usuariosCargados = false;

formularioLogin.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value;


  try {
    const respuesta = await fetch("https://dummyjson.com/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usuario,
        password: password,
        expiresInMins: 30,
      }),
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error(datos.message || "Usuario o contraseña incorrectos.");
    }
    localStorage.setItem("token", JSON.stringify(datos));
    window.location.href = "Index.html";
  } catch (error) {
    console.log("Error al realizar el login:", error);
  }
  
});

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
