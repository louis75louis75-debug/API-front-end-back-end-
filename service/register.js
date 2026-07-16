const API_URL = "http://localhost:5500";
const dotenv = require('dotenv').config();
/**
 * Envoie les données d'inscription au backend
 * @param {Object} userData - { name, email, password, confirmPassword }
 */
export const registerService = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error("Erreur dans le service d'inscription :", error);
    return { error: true, message: "Impossible de joindre le serveur." };
  }
};