/**
 * ============================================================================
 * index.js — Point d'entrée de l'API
 * ============================================================================
 */

// On importe le module Express
const express = require('express')

// 1. ON IMPORTE LE PACKAGE CORS (Assurez-vous de faire 'npm install cors' dans votre terminal backend)
const cors = require('cors')


// On importe notre routeur
const route = require('./routes/index')

// Crée une nouvelle application Express
const app = express()

// Active le CORS pour tout le monde (idéal pour tester sur mobile)
app.use(cors({
  origin: "*" 
}));

// 2. ON ACTIVE LE MIDDLEWARE CORS AVANT LES ROUTES
// Cela autorise votre frontend Next.js (port 3000) à appeler cette API (port 5500)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

// Middleware pour lire le JSON
app.use(express.json())

// Middleware pour les formulaires HTML
app.use(express.urlencoded({ extended: true }))

// On branche notre routeur sur la racine '/'
app.use('/', route)

// Instance de Prisma
const prisma = require('./lib/prisma')

// 3. ON MODIFIE LE PORT POUR JOUER SUR LE PORT 5500 
// (Auparavant il y avait écrit 3000, ce qui bloquait les requêtes vers 5500)
const server = app.listen(5500, () => {
  console.log('Server is running on http://localhost:5500')
})

// Arrêt propre (graceful shutdown)
const shutdown = async () => {
  await prisma.$disconnect()          // ferme la connexion à la base
  server.close(() => process.exit(0)) // ferme le serveur puis quitte le processus
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
