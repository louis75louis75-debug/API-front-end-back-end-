"use client";

import Link from "next/link";

export default function PasswordForgot() {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Récupération de l'adresse email
    const data = new FormData(e.currentTarget);
    const email = data.get('email');

    console.log("Demande de réinitialisation pour :", email);
    
    // Simulation de l'envoi
    alert("Si ce compte existe, un lien de réinitialisation vous a été envoyé par email.");
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
          Forgot password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
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

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Send reset link
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          
          <Link href="/connexion" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}