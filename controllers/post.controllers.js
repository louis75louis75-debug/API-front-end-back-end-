const prisma = require('../lib/prisma')

module.exports = async (req, res) => {
  const { name, rating, description } = req.body

  try {
    // 1. Vérifier si req.user existe (rempli par ton middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: true,
        message: "Utilisateur non authentifié ou ID manquant dans le token"
      })
    }

    // 2. Création de l'avis dans la base de données avec Prisma
    const newReview = await prisma.review.create({
      data: {
        name: name,
        rating: parseInt(rating),
        description: description,
        date: new Date(),
        userId: parseInt(req.user.id) // 👈 C'est cette ligne qui manquait !
      }
    })

    return res.status(201).json({
      error: false,
      message: "Avis créé avec succès",
      review: newReview
    })

  } catch (error) {
    // Permet de voir l'erreur exacte dans le terminal de ton backend
    console.error('Erreur Prisma dans post.controllers :', error)
    
    return res.status(500).json({
      error: true,
      message: "Erreur interne lors de la création de l'avis"
    })
  }
}