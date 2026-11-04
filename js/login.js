const formularioLogin = document.getElementById("form_login");

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

    if (typeof datos.accessToken !== "string" || datos.accessToken.length === 0) {
      throw new Error("DummyJSON no devolvió un token válido.");
    }

    localStorage.setItem("dummyjsonToken", datos.accessToken);
    window.location.href = "Index.html";
  } catch (error) {
    console.log("Error al realizar el login:", error);
  }
  
});
