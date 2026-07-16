
const prisma = require("../lib/prisma")

module.exports = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            name: true, // "name" au lieu de "username" d'après ton schéma User
            _count: {
              select: { 
                reviews: true // 🌟 Au pluriel, correspond exactement à ton schéma !
              }
            }
          }
        }
      },
      orderBy: {
        date: "desc"
      }
    })

    return res.json(reviews)
  } catch (error) {
    console.error("Erreur GET /avis :", error)
    return res.status(500).json({ error: "Erreur serveur" })
  }
}