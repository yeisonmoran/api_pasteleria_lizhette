// src/database/conexion.js

const mongoose = require('mongoose')

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Conectado a MongoDB exitosamente')
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message)
    process.exit(1)  // Si no hay conexión, apaga el servidor
  }
}

module.exports = conectarDB