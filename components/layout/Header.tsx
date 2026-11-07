"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

const links = [
  { href: "#menu",           label: "Menu" },
  { href: "#offres",         label: "Offres" },
  { href: "#notre-histoire", label: "Notre histoire" },
  { href: "#contact",        label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300
          ${scrolled
            ? "bg-[#F5EBDD]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(36,34,31,0.08)] py-3"
            : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt="Cinco Pizza"
              width={48}
              height={48}
              className="object-contain"
              style={{ width: "auto", height: "48px" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-ui text-[0.75rem] font-600 tracking-[0.12em] uppercase
                  text-[#24221F]/70 hover:text-[#C92326] transition-colors duration-200
                  relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px]
                  after:w-0 after:bg-[#C92326] after:transition-all hover:after:w-full"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+33164001010"
              className="font-ui text-[0.75rem] font-600 tracking-wide text-[#24221F]/60
                hover:text-[#24221F] transition-colors flex items-center gap-1.5">
              <Phone className="h-3 w-3" />
              06 00 00 00 00
            </a>
            <a href="#menu" className="btn-primary py-2.5 px-5 text-[0.72rem]">
              Commander
            </a>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 text-[#24221F] cursor-pointer"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-[#24221F]/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-72 bg-[#F5EBDD] shadow-2xl
                flex flex-col p-8"
            >
              <div className="flex items-center justify-between mb-10">
                <Image src="/images/logo.png" alt="Cinco Pizza" width={40} height={40} className="object-contain" style={{ width: "auto", height: "40px" }} />
                <button onClick={() => setOpen(false)} className="p-1.5 text-[#24221F] cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 flex-1">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-ui text-[0.85rem] font-600 tracking-widest uppercase
                      text-[#24221F] hover:text-[#C92326] transition-colors px-3 py-3
                      border-b border-[#E2D5C3]"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
              <a href="tel:+33164001010" className="btn-primary w-full justify-center mt-6">
                <Phone className="h-3.5 w-3.5" />
                Commander
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
