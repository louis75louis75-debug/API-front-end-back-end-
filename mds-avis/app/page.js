"use client"; // Obligatoire pour charger les données dynamiquement

import Navbar from "@/components/navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchAvis = async () => {
    try {
      // 1. On récupère le token stocké dans le navigateur après la connexion
      const token = localStorage.getItem("token"); // Vérifie si ton système de login utilise bien ce nom 'token'

      // 2. On passe le token dans les Headers de la requête fetch
      const response = await fetch("http://localhost:5500/avis", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // C'est ce que ton backend attend pour ne plus bloquer
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAvis(data);
      } else {
        console.error("Le backend a refusé l'accès (ex: token invalide ou manquant)");
      }
    } catch (error) {
      console.error("Impossible de charger les avis :", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAvis();
}, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      {/* Contenu principal */}
      <main className="flex flex-col items-center justify-center pt-32 text-center px-4">
        <p className="mt-6 text-lg leading-8 text-gray-300 max-w-md">
          Une description de votre application. Connectez-vous ou créez un compte pour commencer.
        </p>
        
        {/* Conteneur des boutons d'origine : masqué sur ordi (lg:hidden), visible sur mobile */}
        <div className="mt-10 flex items-center justify-center gap-x-6 lg:hidden">
          <Link
            href="/connexion"
            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Sign In
          </Link>

          <Link 
            href="/register" 
            className="text-sm font-semibold leading-6 text-white hover:text-gray-300"
          >
            Create an account <span aria-hidden="true">→</span>
          </Link>
        </div>
        

        {/* --- SECTION : Affichage des avis --- */}
        <section className="mt-24 w-full max-w-5xl px-4 mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-8">
            Ce que disent nos utilisateurs
          </h2>

          {loading ? (
            <p className="text-gray-400 animate-pulse">Chargement des avis en cours...</p>
          ) : avis.length === 0 ? (
            <p className="text-gray-500">Aucun avis pour le moment.</p>
          ) : (
            /* Grille responsive et stylisée en Tailwind */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
              {avis.map((item) => (
                <div 
                  key={item.id || item._id} 
                  className="rounded-xl bg-gray-800 p-6 shadow-lg border border-gray-700/50 flex flex-col justify-between hover:border-indigo-500/20 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-indigo-400 text-lg">{item.name}</span>
                      {/* Affichage des étoiles */}
                      <span className="text-yellow-400 tracking-wider">
                        {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                      </span>
                    </div>
                    {/* Limite de 3 lignes pour un affichage uniforme en grille */}
                    <p className="text-gray-300 italic text-sm leading-relaxed line-clamp-3">
                      "{item.description}"
                    </p>
                  </div>
                  
                  {/* Bas de carte modifié : Date à gauche, bouton de redirection fonctionnel à droite */}
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
        </section>
      </main>
    </div>
  );
}
