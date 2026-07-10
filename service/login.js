const API_URL = "http://localhost:5500";

/**
 * Envoie les identifiants au backend pour connecter l'utilisateur
 * @param {Object} credentials - { email, password }
 */
export const loginService = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    return await response.json();
  } catch (error) {
    console.error("Erreur dans le service de connexion :", error);
    return { error: true, message: "Impossible de joindre le serveur." };
  }
};