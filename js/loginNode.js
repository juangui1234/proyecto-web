const formularioLogin = document.getElementById("form_login");
const botonLogin = document.getElementById("boton_login");

formularioLogin.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  botonLogin.disabled = true;

  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value;

  try {
    const respuesta = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password }),
    });
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || "No fue posible iniciar sesión.");
    }

    localStorage.setItem("token", JSON.stringify(resultado));
    window.location.href = "Index.html";
  } catch (error) {
    alert(error.message || "No fue posible conectar con el servidor.");
  } finally {
    botonLogin.disabled = false;
  }
});
