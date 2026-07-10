"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; 

export default function RegisterForm() {
  const router = useRouter();

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Récupération des données du formulaire
  const data = new FormData(e.currentTarget);
  const username = data.get('username'); 
  const email = data.get('email');
  const password = data.get('password');
  const confirmPassword = data.get('confirmPassword');

  // Validation de sécurité rapide côté client
  if (password !== confirmPassword) {
    alert("Les mots de passe ne correspondent pas !");
    return;
  }

  try {
    // Envoi des données 
    const response = await fetch("http://localhost:5500/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
      body: JSON.stringify({ 
        name: username, 
        email, 
        password, 
        confirmPassword 
      }),
    });

    if (response.ok) {
      alert("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      router.push("/connexion");
    } else {
      const errorData = await response.json();
      // Affiche le message d'erreur précis renvoyé par le middleware (ex: [M803]...)
      alert(`Erreur : ${errorData.message || "Impossible de créer le compte"}`);
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Une erreur est survenue lors de la connexion au serveur.");
  }
};

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Champ Username */}
          <div>
            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-100">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Confirmation du mot de passe */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-100">
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Already have an account?{' '}
          <Link href="/connexion" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}