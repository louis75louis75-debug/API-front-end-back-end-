"use client";

import Navbar from "@/components/navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsConnected(true);
      setUsername(storedUsername || "Utilisateur");
    } else {
      setIsConnected(false);
      setUsername("");
    }

    const fetchAvis = async () => {
      try {
        const response = await fetch("http://localhost:5500/avis", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    
    setIsConnected(false);
    setUsername("");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 👈 On passe les infos de connexion à la Navbar ici */}
      <Navbar isConnected={isConnected} username={username} handleLogout={handleLogout} />
      
      <main className="flex flex-col items-center justify-center pt-32 text-center px-4">
        <p className="mt-6 text-lg leading-8 text-gray-300 max-w-md">
          Une description de votre application. Connectez-vous ou créez un compte pour commencer.
        </p>

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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
              {avis.map((item) => (
                <div 
                  key={item.id || item._id} 
                  className="rounded-xl bg-gray-800 p-6 shadow-lg border border-gray-700/50 flex flex-col justify-between hover:border-indigo-500/20 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-indigo-400 text-lg">{item.name}</span>
                      <span className="text-yellow-400 tracking-wider">
                        {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                      </span>
                    </div>
                    <p className="text-gray-300 italic text-sm leading-relaxed line-clamp-3">
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
        </section>
      </main>
    </div>
  );
}
