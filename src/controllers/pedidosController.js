// src/controllers/pedidosController.js

const Pedido = require('../models/pedido')
const productos = require('../data/productos')

// 1. VER TODOS LOS PEDIDOS
const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()  // trae todos los pedidos de MongoDB
    res.json(pedidos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos' })
  }
}

// 2. VER UN PEDIDO POR ID 
const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    res.json(pedido)
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el pedido' })
  }
}

// 3. CREAR UN PEDIDO NUEVO 
const crearPedido = async (req, res) => {
  try {
    const { cliente, productoId, cantidad } = req.body

    if (!cliente || !productoId || !cantidad) {
      return res.status(400).json({
        error: 'Faltan datos: necesitas cliente, productoId y cantidad'
      })
    }

    const producto = productos.find(p => p.id === productoId)

    if (!producto) {
      return res.status(404).json({ error: 'Producto no existe' })
    }

    if (!producto.disponible) {
      return res.status(400).json({
        error: `Lo sentimos, "${producto.nombre}" no está disponible `
      })
    }

    // Crear y guardar en MongoDB
    const nuevoPedido = await Pedido.create({
      cliente,
      producto:  producto.nombre,
      cantidad,
      total:     producto.precio * cantidad
    })

    res.status(201).json({
      mensaje: 'Pedido creado con éxito',
      pedido:  nuevoPedido
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el pedido' })
  }
}

// 4. ACTUALIZAR ESTADO
const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body

    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }  
    )

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    res.json({
      mensaje: `Estado actualizado a "${estado}"`,
      pedido
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el pedido' })
  }
}

// 5. ELIMINAR UN PEDIDO
const eliminarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id)

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    res.json({ mensaje: 'Pedido cancelado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el pedido' })
  }
}

module.exports = {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarEstado,
  eliminarPedido
}