"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const links = [
  { href: "/", label: "Home" },
  { href: "/players", label: "Players" },
  { href: "/champions", label: "Champions" },
  { href: "/tours", label: "Tours" },
  { href: "/gallery", label: "Gallery" },
  { href: "/banter", label: "Banter 💬" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="bg-green-900 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-amber-400 font-black text-2xl tracking-tight">DAM</span>
          <span className="text-white font-semibold text-sm leading-tight hidden sm:block">
            DAM Tour
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-amber-400 text-green-900"
                  : "text-green-100 hover:bg-green-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-2 rounded-md text-sm text-green-300 hover:text-white hover:bg-green-700 transition-colors"
            >
              Sign out
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-green-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-white mb-1" />
          <div className="w-5 h-0.5 bg-white mb-1" />
          <div className="w-5 h-0.5 bg-white" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-green-700 px-4 pb-4 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-amber-400 text-green-900"
                  : "text-green-100 hover:bg-green-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md text-sm text-green-300 hover:text-white text-left hover:bg-green-700"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
