// src/controllers/authController.js

const jwt      = require('jsonwebtoken')
const Usuario  = require('../models/usuario')

// ─── FUNCIÓN PARA GENERAR TOKEN ──────────────────────────────
const generarToken = (id) => {
  return jwt.sign(
    { id },                          // payload: datos dentro del token
    process.env.JWT_SECRET,          // firma secreta
    { expiresIn: '7d' }             // expira en 7 días
  )
}

// ─── REGISTRO ────────────────────────────────────────────────
const registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body

    // Validar que llegaron los datos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      })
    }

    // Verificar si el email ya existe
    const usuarioExiste = await Usuario.findOne({ email })
    if (usuarioExiste) {
      return res.status(400).json({
        error: 'Ya existe una cuenta con ese email'
      })
    }

    // Crear el usuario (el password se encripta automáticamente)
    const usuario = await Usuario.create({ nombre, email, password })

    // Generar token
    const token = generarToken(usuario._id)

    res.status(201).json({
      mensaje: '✅ Cuenta creada exitosamente',
      token,
      usuario: {
        id:     usuario._id,
        nombre: usuario.nombre,
        email:  usuario.email,
        rol:    usuario.rol
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la cuenta' })
  }
}

// ─── LOGIN ───────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y password son obligatorios'
      })
    }

    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(401).json({
        error: 'Email o password incorrectos'
      })
    }

    // Verificar el password
    const passwordCorrecto = await usuario.verificarPassword(password)
    if (!passwordCorrecto) {
      return res.status(401).json({
        error: 'Email o password incorrectos'
      })
    }

    // Generar token
    const token = generarToken(usuario._id)

    res.json({
      mensaje: '✅ Login exitoso',
      token,
      usuario: {
        id:     usuario._id,
        nombre: usuario.nombre,
        email:  usuario.email,
        rol:    usuario.rol
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

module.exports = { registro, login }
