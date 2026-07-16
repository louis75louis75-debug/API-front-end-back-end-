"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"; 

export default function Connexion() {
  const router = useRouter();
  
  // État pour gérer le message d'erreur du Toast
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    const data = new FormData(e.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    try {
      const response = await fetch("http://localhost:5500/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.jwt) {
          localStorage.setItem("token", result.jwt);
          localStorage.setItem("username", result.username); 
        }
        
        router.push("/");
      } else {
        setErrorMessage("Mot de passe ou email incorrect.");
        setTimeout(() => {
          setErrorMessage("");
        }, 4000);
      }

    } catch (error) {
      console.error("Erreur réseau :", error);
      setErrorMessage("Une erreur est survenue lors de la connexion au serveur.");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }
  }; // 👈 L'accolade fermante manquante était ici pour clore handleSubmit !

  return (
    <>
      {/* --- BLOC TOAST --- */}
      {errorMessage && (
        <div className="fixed top-5 right-5 z-50">
          <div
            className="bg-red-50 text-sm p-4 rounded-md border border-red-100 w-max min-w-xs max-w-sm dark:bg-red-900/20 dark:border-red-800/40 shadow-xl"
            role="alert"
          >
            <div className="flex items-center gap-2.5 text-red-900 font-medium dark:text-red-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-[18px] fill-current overflow-visible" viewBox="0 0 512 512" aria-hidden="true">
                <path d="M256 0C114.508 0 0 114.497 0 256c0 141.493 114.497 256 256 256 141.492 0 256-114.497 256-256C512 114.507 397.503 0 256 0m0 472c-119.384 0-216-96.607-216-216 0-119.385 96.607-216 216-216 119.384 0 216 96.607 216 216 0 119.385-96.607 216-216 216" />
                <path d="M343.586 315.302 284.284 256l59.302-59.302c7.81-7.81 7.811-20.473.001-28.284-7.812-7.811-20.475-7.81-28.284 0L256 227.716l-59.303-59.302c-7.809-7.811-20.474-7.811-28.284 0s-7.81 20.474.001 28.284L227.716 256l-59.302 59.302c-7.811 7.811-7.812 20.474-.001 28.284 7.813 7.812 20.476 7.809 28.284 0L256 284.284l59.303 59.302c7.808 7.81 20.473 7.811 28.284 0s7.81-20.474-.001-28.284" />
              </svg>
              
              <p>{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- FORMULAIRE DE CONNEXION --- */}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                  Password
                </label>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-semibold text-indigo-400 hover:text-indigo-300">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Not a member?{' '}
            <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}