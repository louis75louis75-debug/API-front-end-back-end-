const prisma = require('../lib/prisma')

module.exports = async (req, res) => {
  const { id } = req.params // L'id de l'avis à supprimer

  try {
    // 1. Trouver l'avis en base de données
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) }
    })

    if (!review) {
      return res.status(404).json({ error: true, message: "Avis introuvable" })
    }

    // 2. Sécurité : Vérifier si le userId du token correspond au userId de l'avis
    if (review.userId !== parseInt(req.user.id)) {
      return res.status(403).json({ error: true, message: "Vous n'êtes pas autorisé à supprimer cet avis" })
    }

    // 3. Suppression
    await prisma.review.delete({
      where: { id: parseInt(id) }
    })

    return res.status(200).json({ error: false, message: "Avis supprimé avec succès" })

  } catch (error) {
    console.error("Erreur suppression backend :", error)
    return res.status(500).json({ error: true, message: "Erreur serveur" })
  }
}