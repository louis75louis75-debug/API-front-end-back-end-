const { hashPassword } = require('../lib/argon2') // Importation propre par destructuring
const prisma = require('../lib/prisma')
const jwt = require('jsonwebtoken')

module.exports = async (req, res) => {
  const { password, token } = req.body

  if (!password || !token) {
    return res.status(400).json({
      error: true,
      message: "Le token et le nouveau mot de passe sont obligatoires."
    })
  }

  let decoded
  
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (jwtError) {
    console.error("Erreur de validation du token :", jwtError)
    return res.status(401).json({
      error: true,
      message: "Le lien de réinitialisation est invalide ou a expiré."
    })
  }

  try {
    // 1. Hachage du mot de passe
    const hash = await hashPassword(password)

    // 2. Mise à jour dans la base de données
    await prisma.user.update({
      where: { 
        id: decoded.id // Si ton id est un entier (Int) dans ton schema.prisma, remplace par : parseInt(decoded.id, 10)
      },
      data: {
        password: hash
      }
    })

    return res.status(200).json({
      error: false,
      message: "Votre mot de passe a été réinitialisé avec succès."
    })

  } catch (error) {
    // 👈 CE BLOC CATCH VA DÉSERVIR TOUTES LES INFOS DANS TON TERMINAL
    console.log("================== ERREUR DETECTEE ==================")
    console.error("Nom de l'erreur :", error.name)
    console.error("Message d'erreur :", error.message)
    console.error("Détails complets :", error)
    console.log("=====================================================")
    
    return res.status(500).json({
      error: true,
      message: "Une erreur interne est survenue lors de la modification du mot de passe."
    })
  }
}