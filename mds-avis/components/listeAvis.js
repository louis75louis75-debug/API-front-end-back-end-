"use client";

import Navbar from "@/components/navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// 🌟 Une seule adresse de base pour éviter les conflits d'IP 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500";

export default function ListeAvisComponent() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userIdConnecte, setUserIdConnecte] = useState(null);
  const [username, setUsername] = useState("");

  // Formulaire de création d'un avis
  const [rating, setRating] = useState(5);
  const [description, setDescription] = useState("");

  // ÉTATS POUR LA MODIFICATION
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsConnected(true);
      setUsername(storedUsername || "Utilisateur");
      try {
        const decoded = jwtDecode(token);
        setUserIdConnecte(decoded.id);
      } catch (err) {
        console.error("Erreur lors du décodage du token", err);
        setUserIdConnecte(null);
      }
    } else {
      setIsConnected(false);
      setUsername("");
      setUserIdConnecte(null);
    }

    const fetchAvis = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/avis`);
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

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    
    setIsConnected(false);
    setUsername("");
    setUserIdConnecte(null);
    
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/add/avis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ 
          name: username, 
          rating: Number(rating), 
          description, 
          date: new Date() 
        }),
      });

      if (response.ok) {
        setDescription("");
        setShowForm(false);
        // Au lieu de recharger toute la page (ce qui casse l'expérience utilisateur),
        // on recharge la liste en refaisant un fetch léger
        const res = await fetch(`${API_BASE_URL}/avis`);
        if (res.ok) {
          const data = await res.json();
          setAvis(data);
        }
      } else {
        const errorData = await response.json();
        console.error("Détail de l'erreur backend :", errorData.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis :", error);
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id || item._id);
    setEditRating(item.rating);
    setEditDescription(item.description);
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/avis/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: Number(editRating), description: editDescription }),
      });

      if (response.ok) {
        setAvis(avis.map(item => (item.id || item._id) === id ? { ...item, rating: Number(editRating), description: editDescription } : item));
        setEditingId(null); 
      } else {
        alert("Erreur lors de la modification");
      }
    } catch (error) {
      console.error("Erreur PUT frontend :", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");
    if (!window.confirm("Voulez-vous vraiment supprimer cet avis ?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/avis/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAvis(avis.filter((item) => (item.id || item._id) !== id));
      }
    } catch (error) {
      console.error("Erreur DELETE frontend :", error);
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

        {/* --- FORMULAIRE D'AVIS --- */}
        {showForm && (
          <div className="mb-12 bg-gray-800/50 border border-gray-700 p-6 rounded-xl max-w-2xl mx-auto animate-fade-in">
            <h3 className="text-lg font-semibold text-indigo-400 mb-4">Votre avis nous intéresse</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Nom / Pseudo</label>
                <input
                  type="text"
                  required
                  disabled
                  value={username}
                  className="w-full rounded-md border-0 bg-gray-950/80 px-3 py-2 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-850 cursor-not-allowed outline-none text-sm"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Le pseudo est automatiquement lié à votre compte connecté.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Note (sur 5)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-md border-0 bg-gray-900/60 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm"
                >
                  <option value={5}>★★★★★ (5/5)</option>
                  <option value={4}>★★★★☆ (4/5)</option>
                  <option value={3}>★★★☆☆ (3/5)</option>
                  <option value={2}>★★☆☆☆ (2/5)</option>
                  <option value={1}>★☆☆☆☆ (1/5)</option>
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
                />
              </div>

              <button type="submit" className="w-full rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
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
            {avis.map((item) => {
              const currentId = item.id || item._id;
              const isEditing = editingId === currentId;
              const countReviews = item.user?._count?.reviews || item.user?._count?.Review || 0;

              return (
                <div 
                  key={currentId} 
                  className="rounded-xl bg-gray-800 p-6 shadow-lg border border-gray-700/50 flex flex-col justify-between hover:border-indigo-500/20 transition-all"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <span className="font-semibold text-indigo-400 text-sm">Modifier votre avis</span>
                      <select
                        value={editRating}
                        onChange={(e) => setEditRating(Number(e.target.value))}
                        className="w-full rounded-md border-0 bg-gray-900 px-2 py-1 text-white ring-1 ring-gray-700 text-sm"
                      >
                        <option value={5}>5/5</option>
                        <option value={4}>4/5</option>
                        <option value={3}>3/5</option>
                        <option value={2}>2/5</option>
                        <option value={1}>1/5</option>
                      </select>
                      <textarea
                        rows={3}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full rounded-md border-0 bg-gray-900 px-2 py-1 text-white ring-1 ring-gray-700 text-sm"
                      />
                      <div className="flex space-x-2">
                        <button onClick={() => handleUpdate(currentId)} className="bg-green-600 px-2.5 py-1 rounded text-xs">Sauvegarder</button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-600 px-2.5 py-1 rounded text-xs">Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="font-semibold text-indigo-400 text-lg block line-clamp-1">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-gray-500 block mt-0.5">
                            {countReviews} {countReviews > 1 ? "avis publiés" : "avis publié"}
                          </span>
                        </div>
                        <span className="text-yellow-400 tracking-wider text-sm flex-shrink-0 mt-1">
                          {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                        </span>
                      </div>
                      <p className="text-gray-300 italic text-sm leading-relaxed line-clamp-4">
                        "{item.description}"
                      </p>
                    </div>
                  )}
                  
                  {/* Actions de modifications pour l'auteur de l'avis */}
                  {!isEditing && userIdConnecte && userIdConnecte !== "null" && userIdConnecte !== "undefined" && String(userIdConnecte) === String(item.userId) && (
                    <div className="mt-4 pt-2 flex justify-end space-x-2 border-t border-gray-700/30">
                      <button 
                        onClick={() => startEditing(item)}
                        className="text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-1 rounded hover:bg-indigo-600/40 transition-all"
                      >
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(currentId)}
                        className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded hover:bg-red-600/40 transition-all"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-gray-700/50 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString("fr-FR")}
                    </span>
                    <Link 
                      href={`/avis/${currentId}`}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Voir le détail →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}