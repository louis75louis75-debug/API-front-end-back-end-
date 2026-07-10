"use client";

import Navbar from "@/components/navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

// On l'appelle ListeAvisComponent par exemple
export default function ListeAvisComponent() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // Gère l'affichage du formulaire
  const [isConnected, setIsConnected] = useState(false);

  // Formulaire d'avis
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");
    setIsConnected(!!token);

    const fetchAvis = async () => {
      try {
        // Fetch classique (ajoute le token si ton backend l'exige aussi pour la lecture globale)
        const response = await fetch("http://localhost:5500/avis", {
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAvis(data);
        }
      } catch (error) {
        console.error("Impossible de charger les avis :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvis();
  }, []);

  // Soumission du nouvel avis
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5500/avis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name, rating: Number(rating), description, date: new Date() }),
      });

      if (response.ok) {
        const newAvis = await response.json();
        // Optionnel : si ton backend renvoie l'objet créé, on l'ajoute directement à l'écran
        setAvis([newAvis, ...avis]); 
        // Reset du formulaire
        setName("");
        setDescription("");
        setShowForm(false);
        // Recharger la page pour être sûr d'avoir la liste à jour
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis :", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <main className="max-w-6xl w-full mx-auto pt-32 px-4 pb-16">
        
        {/* --- EN-TÊTE DE LA PAGE --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-800 pb-8 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Avis de la communauté
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Retrouvez l'ensemble des retours de nos utilisateurs.
            </p>
          </div>

          {/* Bouton d'action adaptatif */}
          <div className="mt-4 sm:mt-0">
            {isConnected ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full sm:w-auto rounded-md bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 transition-colors"
              >
                {showForm ? "Fermer le formulaire" : "Laisser un avis"}
              </button>
            ) : (
              <Link
                href="/connexion"
                className="block text-center rounded-md bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm font-semibold text-indigo-400 shadow-sm hover:bg-gray-750 transition-colors"
              >
                Connectez-vous pour laisser un avis
              </Link>
            )}
          </div>
        </div>

        {/* --- FORMULAIRE D'AVIS AJOUTÉ --- */}
        {showForm && (
          <div className="mb-12 bg-gray-800/50 border border-gray-700 p-6 rounded-xl max-w-2xl mx-auto animate-fade-in">
            <h3 className="text-lg font-semibold text-indigo-400 mb-4">Votre avis nous intéresse</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Nom / Pseudo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border-0 bg-gray-900/60 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm"
                  placeholder="Ex: Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Note (sur 5)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full rounded-md border-0 bg-gray-900/60 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm"
                >
                  <option value="5">★★★★★ (5/5)</option>
                  <option value="4">★★★★☆ (4/5)</option>
                  <option value="3">★★★☆☆ (3/5)</option>
                  <option value="2">★★☆☆☆ (2/5)</option>
                  <option value="1">★☆☆☆☆ (1/5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Commentaire</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border-0 bg-gray-900/60 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm"
                  placeholder="Qu'avez-vous pensé de l'application ?"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Publier mon avis
              </button>
            </form>
          </div>
        )}

        {/* --- GRILLE DES AVIS EXISTANTS --- */}
        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">Chargement des avis...</p>
        ) : avis.length === 0 ? (
          <p className="text-center text-gray-500 italic">Aucun avis disponible.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {avis.map((item) => (
              <div 
                key={item.id || item._id} 
                className="rounded-xl bg-gray-800 p-6 shadow-lg border border-gray-700/50 flex flex-col justify-between hover:border-indigo-500/20 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-indigo-400 text-lg line-clamp-1">{item.name}</span>
                    <span className="text-yellow-400 tracking-wider text-sm flex-shrink-0">
                      {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                    </span>
                  </div>
                  <p className="text-gray-300 italic text-sm leading-relaxed line-clamp-4">
                    "{item.description}"
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-700/50 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString("fr-FR")}
                  </span>
                  <Link 
                    href={`/avis/${item.id || item._id}`}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Voir le détail →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}