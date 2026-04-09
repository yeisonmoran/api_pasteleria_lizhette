// index.js

require('dotenv').config()          // carga las variables del .env

const express       = require('express')
const conectarDB    = require('./src/database/conexion')
const pedidosRoutes = require('./src/routes/pedidosRoutes')
const authRoutes    = require('./src/routes/authRoutes')   

const app = express()
app.use(express.json())

// Conectar a MongoDB ANTES de arrancar el servidor
conectarDB()

app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a Pastelería Sweet Node' })
})
app.use('/auth',    authRoutes)    
app.use('/pedidos', pedidosRoutes)

const PUERTO = process.env.PORT || 3600
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
})
