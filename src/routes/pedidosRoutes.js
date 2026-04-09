// src/routes/pedidosRoutes.js

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/pedidosController');
const { proteger } = require('../middleWares/authMiddleware');

// GET    /pedidos         → Ver todos los pedidos
// GET    /pedidos/:id     → Ver un pedido específico
// POST   /pedidos         → Crear un pedido nuevo
// PATCH  /pedidos/:id     → Actualizar estado
// DELETE /pedidos/:id     → Cancelar pedido

router.get('/',      controller.obtenerPedidos);
router.get('/:id',   controller.obtenerPedidoPorId);
router.post('/',     controller.crearPedido);
router.patch('/:id', controller.actualizarEstado);
router.delete('/:id',controller.eliminarPedido);

module.exports = router;