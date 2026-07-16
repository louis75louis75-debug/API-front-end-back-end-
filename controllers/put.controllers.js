const prisma = require('../lib/prisma')

module.exports = async (req, res) => {
  const { id } = req.params
  const { rating, description } = req.body

  try {
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) }
    })

    if (!review) {
      return res.status(404).json({ error: true, message: "Avis introuvable" })
    }

    // Sécurité : Vérifier le propriétaire
    if (review.userId !== parseInt(req.user.id)) {
      return res.status(403).json({ error: true, message: "Vous n'êtes pas autorisé à modifier cet avis" })
    }

    // Mise à jour des données
    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: {
        rating: parseInt(rating),
        description: description
      }
    })

    return res.status(200).json(updatedReview)

  } catch (error) {
    console.error("Erreur modification backend :", error)
    return res.status(500).json({ error: true, message: "Erreur serveur" })
  }
}
