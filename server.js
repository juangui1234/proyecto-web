const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const db = require("./database");
const app = express();
const SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// REGISTRO
app.post("/api/usuarios", (req, res) => {
    const { nombre, correo, password, carrera } = req.body;
if (!nombre || !correo || !password) {
        return res.status(400).json({
            mensaje: "Complete los campos obligatorios"
        });
    }

    try {
        const hash = bcrypt.hashSync(password, 10);

        const resultado = db.prepare(`
            INSERT INTO usuarios (nombre, correo, password, carrera)
            VALUES (?, ?, ?, ?)
        `).run(nombre, correo, hash, carrera || "");

        res.status(201).json({
            mensaje: "Usuario registrado",
            id: resultado.lastInsertRowid
        });
    } catch (error) {
        res.status(400).json({
            mensaje: "No fue posible registrar. Verifique si el correo ya existe."
        });
    }
});

// LOGIN
app.post("/api/login", (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({
            mensaje: "Ingrese correo y contraseña"
        });
    }

    const usuario = db.prepare(
        "SELECT * FROM usuarios WHERE correo = ?"
    ).get(correo);

    if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
        return res.status(401).json({
            mensaje: "Correo o contraseña incorrectos"
        });
    }

    const token = jwt.sign(
        { id: usuario.id },
        SECRET,
        { expiresIn: "2h" }
    );

    res.json({
        mensaje: "Inicio de sesión exitoso",
        token,
        usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            carrera: usuario.carrera
        }
    });
});

// MIDDLEWARE PARA VALIDAR TOKEN
function verificarToken(req, res, next) {
    const autorizacion = req.headers.authorization;

    if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
        return res.status(401).json({
            mensaje: "Debe iniciar sesión"
        });
    }

    const token = autorizacion.split(" ")[1];

    try {
        req.usuario = jwt.verify(token, SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            mensaje: "Token inválido o vencido"
        });
    }
}

// CONSULTAR
app.get("/api/usuarios", verificarToken, (req, res) => {
    const usuarios = db.prepare(`
        SELECT id, nombre, correo, carrera
        FROM usuarios
    `).all();

    res.json(usuarios);
});

// ACTUALIZAR
app.put("/api/usuarios/:id", verificarToken, (req, res) => {
    const { nombre, carrera } = req.body;

    if (!nombre) {
        return res.status(400).json({
            mensaje: "El nombre es obligatorio"
        });
    }

    const resultado = db.prepare(`
        UPDATE usuarios
        SET nombre = ?, carrera = ?
        WHERE id = ?
    `).run(nombre, carrera || "", req.params.id);

    if (resultado.changes === 0) {
        return res.status(404).json({
            mensaje: "Usuario no encontrado"
        });
    }

    res.json({ mensaje: "Usuario actualizado" });
});
// ELIMINAR
app.delete("/api/usuarios/:id", verificarToken, (req, res) => {
    const resultado = db.prepare(
        "DELETE FROM usuarios WHERE id = ?"
    ).run(req.params.id);

    if (resultado.changes === 0) {
        return res.status(404).json({
            mensaje: "Usuario no encontrado"
        });
    }

    res.json({ mensaje: "Usuario eliminado" });
});

app.listen(3000, () => {
    console.log("API funcionando en http://localhost:3000");
});
