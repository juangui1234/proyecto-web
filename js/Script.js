// // Sin JQuery
// // campos
// const nombre=document.getElementById("nombre")
// const nombreJQuery=$("#nombre")
// const celular=document.getElementById("celular")
// const direccion=document.getElementById("direccion")
// const correo=document.getElementById("correo")

// //Boton de registo
// const botonRegistro=document.getElementById("boton_registro")

// //Parrafos
// const formNombre=document.getElementById("form_nombre")
// const formCelular=document.getElementById("form_celular")
// const formDireccion=document.getElementById("form_direccion")
// const formCorreo=document.getElementById("form_correo")

// //Accion del boton

// botonRegistro.addEventListener("click", (e) => {
//     alert("Registro exitoso")
//     formNombre.textContent = `Nombre: ${nombre.value}`
//     formCelular.textContent = `Celular: ${celular.value}`
//     formDireccion.textContent = `Direccion: ${direccion.value}`
//     formCorreo.textContent = `Correo: ${correo.value}`
// })

// Con JQuery
$("#boton_registro").click(function(){
    alert("Registro exitoso")
    $("#form_nombre").text(`Nombre: ${$("#nombre").val()}`)
    $("#form_celular").text(`Celular: ${$("#celular").val()}`)
    $("#form_direccion").text(`Direccion: ${$("#direccion").val()}`)
    $("#form_correo").text(`Correo: ${$("#correo").val()}`)
})

$(".boton_mas_info").each(function(){
    $(this).click(function(e){
        $("#modal_imagen").attr("src", $(this).closest(".tarjeta").find(".imagen_programa").attr("src"))
        $("#modal_titulo").text($(this).closest(".tarjeta").find("h3").text())
        $("#modal_descripcion").text($(this).closest(".tarjeta").find("p").text())
        $("#overlay").addClass("mostrar")
    })
})

$("#overlay").click(function(e) { 
    $("#overlay").removeClass("mostrar")
})

