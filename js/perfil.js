const seccionUsuarios = document.getElementById("gestion_usuarios");
const enlaceIniciarSesion = document.getElementById("link_iniciar_sesion");
const botonCerrarSesion = document.getElementById("boton_cerrar_sesion");
const botonRecargarUsuarios = document.getElementById("recargar_usuarios");
const listaUsuarios = document.getElementById("lista_usuarios");
const estadoUsuarios = document.getElementById("estado_usuarios");
const formularioActualizar = document.getElementById("form_actualizar_usuario");
const usuarioSeleccionado = document.getElementById("usuario_seleccionado");
const nombreUsuario = document.getElementById("nombre_usuario");
const carreraUsuario = document.getElementById("carrera_usuario");
const botonGuardarUsuario = document.getElementById("guardar_usuario");
const estadoActualizacion = document.getElementById("estado_actualizacion");

let sesion = leerSesion();
let usuarios = [];

function leerSesion() {
  try {
    const guardada = JSON.parse(localStorage.getItem("token") || "null");
    if (guardada && typeof guardada.token === "string" && guardada.usuario?.id) {
      return guardada;
    }
  } catch (error) {
    localStorage.removeItem("token");
  }
  return null;
}

function mostrarSesion() {
  const autenticado = Boolean(sesion);
  seccionUsuarios.hidden = !autenticado;
  enlaceIniciarSesion.hidden = autenticado;
  botonCerrarSesion.hidden = !autenticado;
}

function cerrarSesion() {
  localStorage.removeItem("token");
  sesion = null;
  mostrarSesion();
}

async function solicitarApi(ruta, opciones) {
  if (!sesion) {
    throw new Error("Inicia sesión para administrar usuarios.");
  }

  const respuesta = await fetch(`http://localhost:3000${ruta}`, {
    ...opciones,
    headers: {
      ...opciones.headers,
      Authorization: `Bearer ${sesion.token}`,
    },
  });
  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      cerrarSesion();
      window.location.href = "login.html";
    }
    throw new Error(resultado.mensaje || "No fue posible completar la solicitud.");
  }

  return resultado;
}

function mostrarError(elemento, error) {
  elemento.textContent =
    error instanceof TypeError
      ? "No se pudo conectar con el servidor. Verifica que esté ejecutándose en http://localhost:3000."
      : error.message;
}

function seleccionarUsuario(id) {
  const usuario = usuarios.find((elemento) => String(elemento.id) === String(id));
  if (!usuario) {
    usuarioSeleccionado.value = "";
    nombreUsuario.value = "";
    carreraUsuario.value = "";
    botonGuardarUsuario.disabled = true;
    return;
  }

  usuarioSeleccionado.value = String(usuario.id);
  nombreUsuario.value = usuario.nombre;
  carreraUsuario.value = usuario.carrera || "";
  botonGuardarUsuario.disabled = false;
  estadoActualizacion.textContent = "";
}

function crearBotonAccion(texto, clase, accion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = clase;
  boton.textContent = texto;
  boton.addEventListener("click", accion);
  return boton;
}

function mostrarUsuarios() {
  listaUsuarios.replaceChildren();
  usuarioSeleccionado.replaceChildren();
  usuarioSeleccionado.add(new Option("Selecciona un usuario en la lista", ""));

  usuarios.forEach(function (usuario) {
    const fila = document.createElement("tr");
    const nombre = document.createElement("td");
    const correo = document.createElement("td");
    const carrera = document.createElement("td");
    const acciones = document.createElement("td");
    const botonEditar = crearBotonAccion("Editar", "boton_editar_usuario", function () {
      seleccionarUsuario(usuario.id);
    });
    const botonEliminar = crearBotonAccion("Eliminar", "boton_eliminar_usuario", function () {
      eliminarUsuario(usuario);
    });

    nombre.textContent = usuario.nombre;
    correo.textContent = usuario.correo;
    carrera.textContent = usuario.carrera || "Sin carrera";
    acciones.className = "acciones_usuario";
    acciones.append(botonEditar, botonEliminar);
    fila.append(nombre, correo, carrera, acciones);
    listaUsuarios.appendChild(fila);

    usuarioSeleccionado.add(
      new Option(`${usuario.nombre} — ${usuario.correo}`, String(usuario.id))
    );
  });

  const hayUsuarios = usuarios.length > 0;
  usuarioSeleccionado.disabled = !hayUsuarios;
  nombreUsuario.disabled = !hayUsuarios;
  carreraUsuario.disabled = !hayUsuarios;
  usuarioSeleccionado.value = "";
  nombreUsuario.value = "";
  carreraUsuario.value = "";
  botonGuardarUsuario.disabled = true;
  estadoUsuarios.textContent = `Se encontraron ${usuarios.length} usuarios.`;
}

async function cargarUsuarios() {
  botonRecargarUsuarios.disabled = true;
  estadoUsuarios.textContent = "Consultando usuarios...";

  try {
    const resultado = await solicitarApi("/api/usuarios", { method: "GET" });
    if (!Array.isArray(resultado)) {
      throw new Error("La respuesta de usuarios no tiene el formato esperado.");
    }
    usuarios = resultado;
    mostrarUsuarios();
  } catch (error) {
    mostrarError(estadoUsuarios, error);
  } finally {
    botonRecargarUsuarios.disabled = false;
  }
}

async function eliminarUsuario(usuario) {
  if (!confirm(`¿Seguro que quieres eliminar a ${usuario.nombre}?`)) {
    return;
  }

  estadoUsuarios.textContent = "Eliminando usuario...";
  try {
    const resultado = await solicitarApi(
      `/api/usuarios/${encodeURIComponent(usuario.id)}`,
      { method: "DELETE" }
    );
    if (String(sesion.usuario.id) === String(usuario.id)) {
      cerrarSesion();
      window.location.href = "login.html";
      return;
    }

    usuarios = usuarios.filter((elemento) => String(elemento.id) !== String(usuario.id));
    mostrarUsuarios();
    estadoUsuarios.textContent = resultado.mensaje || "Usuario eliminado.";
  } catch (error) {
    mostrarError(estadoUsuarios, error);
  }
}

botonCerrarSesion.addEventListener("click", cerrarSesion);
botonRecargarUsuarios.addEventListener("click", cargarUsuarios);

usuarioSeleccionado.addEventListener("change", function () {
  seleccionarUsuario(usuarioSeleccionado.value);
});

formularioActualizar.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  const id = usuarioSeleccionado.value;
  if (!id) {
    estadoActualizacion.textContent = "Selecciona un usuario para actualizar.";
    return;
  }

  botonGuardarUsuario.disabled = true;
  estadoActualizacion.textContent = "Actualizando usuario...";
  const cambios = {
    nombre: nombreUsuario.value.trim(),
    carrera: carreraUsuario.value,
  };

  try {
    const resultado = await solicitarApi(`/api/usuarios/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cambios),
    });

    usuarios = usuarios.map((usuario) =>
      String(usuario.id) === id ? { ...usuario, ...cambios } : usuario
    );
    if (String(sesion.usuario.id) === id) {
      sesion.usuario = { ...sesion.usuario, ...cambios };
      localStorage.setItem("token", JSON.stringify(sesion));
    }
    mostrarUsuarios();
    seleccionarUsuario(id);
    estadoActualizacion.textContent = resultado.mensaje || "Usuario actualizado.";
  } catch (error) {
    mostrarError(estadoActualizacion, error);
    botonGuardarUsuario.disabled = false;
  }
});

mostrarSesion();
if (sesion) {
  cargarUsuarios();
}
