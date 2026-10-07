// campos
const nombre=document.getElementById("nombre")
const celular=document.getElementById("celular")
const direccion=document.getElementById("direccion")
const correo=document.getElementById("correo")

//Boton de registo
const botonRegistro=document.getElementById("boton_registro")

//Parrafos
const formNombre=document.getElementById("form_nombre")
const formCelular=document.getElementById("form_celular")
const formDireccion=document.getElementById("form_direccion")
const formCorreo=document.getElementById("form_correo")

//Accion del boton

botonRegistro.addEventListener("click", (e) => {
    alert("Registro exitoso")
    formNombre.textContent = `Nombre: ${nombre.value}`
    formCelular.textContent = `Celular: ${celular.value}`
    formDireccion.textContent = `Direccion: ${direccion.value}`
    formCorreo.textContent = `Correo: ${correo.value}`
})