'use client'

import { useState , useEffect } from 'react'
import Link from "next/link"
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'

const products = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 🌟 On gère l'état de connexion directement dans la Navbar
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsConnected(true);
      setUsername(storedUsername || "Utilisateur");
    } else {
      setIsConnected(false);
      setUsername("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    
    setIsConnected(false);
    setUsername("");
    
    // On recharge pour appliquer le changement d'état sur toute la page
    window.location.reload();
  };

  return (
    <header className="bg-slate-950 border-b border-indigo-500/20 sticky top-0 z-50">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 relative">
        
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Bouton Menu Mobile */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        {/* Liens Centrés */}
        <div className="hidden lg:flex lg:gap-x-12 absolute left-1/2 -translate-x-1/2">
          <Link href="#" className="text-sm/6 font-semibold text-white hover:text-indigo-400 transition-colors">
            Film
          </Link>
          <Link href="/avis" className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors">
            Avis
          </Link>
        </div>
        
        {/* Boutons / Profil Desktop */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          {isConnected ? (
            <>
              <span className="text-sm font-semibold leading-6 text-gray-400">
                {username}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors pointer"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/connexion" 
                className="text-sm font-semibold leading-6 text-white hover:text-gray-300"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors"
              >
                Create an account
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Menu Mobile */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-950 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
            >
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Film
                </Link>
                <Link
                  href="/avis"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Avis
                </Link>
              </div>

              <div className="py-6 space-y-4">
                {isConnected ? (
                  <div className="flex flex-col space-y-3">
                    <span className="text-sm font-medium text-gray-300 bg-gray-800 px-3 py-2 rounded-md border border-gray-700 w-full text-center">
                       {username}
                    </span>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-center text-sm bg-red-600/20 text-red-400 border border-red-500/30 py-2 rounded-md hover:bg-red-600/40 transition-all font-semibold"
                    >
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/connexion"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-white hover:bg-white/5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block text-center rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create an account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}