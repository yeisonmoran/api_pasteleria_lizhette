// src/models/Usuario.js

const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type:     String,
      required: true,
      trim:     true
    },
    email: {
      type:      String,
      required:  true,
      unique:    true,   // no puede haber dos usuarios con el mismo email
      lowercase: true,   // guarda el email siempre en minúsculas
      trim:      true
    },
    password: {
      type:     String,
      required: true,
      minlength: 6      // mínimo 6 caracteres
    },
    rol: {
      type:    String,
      enum:    ['cliente', 'admin'],
      default: 'cliente'
    }
  },
  { timestamps: true }
)

// ─── ENCRIPTAR PASSWORD ANTES DE GUARDAR ────────────────────
// Esto se ejecuta automáticamente antes de cada .save()
usuarioSchema.pre('save', async function(next) {
  // Si el password no fue modificado, no lo encriptes de nuevo
  if (!this.isModified('password')) return next()

  // Encripta el password (10 = nivel de seguridad)
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// ─── MÉTODO PARA VERIFICAR PASSWORD ─────────────────────────
// Lo usaremos en el login
usuarioSchema.methods.verificarPassword = async function(passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password)
}

const Usuario = mongoose.model('Usuario', usuarioSchema)

module.exports = Usuario

