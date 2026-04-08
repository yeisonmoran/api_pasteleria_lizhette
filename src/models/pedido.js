// src/models/Pedido.js

const mongoose = require('mongoose')

// El Schema define la "forma" del documento
const pedidoSchema = new mongoose.Schema(
  {
    cliente: {
      type: String,       // debe ser texto
      required: true,     // es obligatorio
      trim: true          // elimina espacios al inicio y al final
    },
    producto: {
      type: String,
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1              // mínimo 1
    },
    total: {
      type: Number,
      required: true
    },
    estado: {
      type: String,
      enum: ['pendiente', 'en preparación', 'listo', 'entregado'],  // solo estos valores
      default: 'pendiente'   // valor por defecto
    }
  },
  {
    timestamps: true  // agrega automáticamente createdAt y updatedAt
  }
)

// Creamos el modelo a partir del schema
const Pedido = mongoose.model('Pedido', pedidoSchema)

module.exports = Pedido