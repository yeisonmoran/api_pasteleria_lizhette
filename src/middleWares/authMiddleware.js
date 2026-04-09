const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')


const proteger = async (req, res, next) => {
  try {
    // 1. Verificar que venga el token en los headers
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Acceso denegado. No enviaste un token'
      })
    }

    // 2. Extraer el token (viene como "Bearer eyJhbG...")
    const token = authHeader.split(' ')[1]

    // 3. Verificar que el token sea válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 4. Buscar el usuario en la base de datos
    const usuario = await Usuario.findById(decoded.id)

    if (!usuario) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    // 5. Agregar el usuario a req para usarlo en las rutas
    req.usuario = usuario

    // 6. Continuar a la ruta
    next()

  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

module.exports = { proteger }