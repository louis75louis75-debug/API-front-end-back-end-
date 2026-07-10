"use client";

import Link from "next/link";

export default function PasswordReset() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    console.log("Nouveau mot de passe soumis");
    
    alert("Votre mot de passe a bien été réinitialisé !");
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
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Please enter your new password below.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Nouveau Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
              New Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Confirmation du mot de passe */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-100">
              Confirm New Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Update password
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