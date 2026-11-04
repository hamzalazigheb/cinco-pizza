"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Pizza, Tag,
  History, Settings, LogOut, Menu, X,
  Circle,
} from "lucide-react";

const NAV = [
  { label: "Tableau de bord", href: "/admin",             icon: LayoutDashboard, active: true  },
  { label: "Commandes",       href: "/admin",             icon: ShoppingBag,     active: true  },
  { label: "Menu & Pizzas",   href: "/admin",             icon: Pizza,           active: false },
  { label: "Promotions",      href: "/admin",             icon: Tag,             active: false },
  { label: "Historique",      href: "/admin",             icon: History,         active: false },
  { label: "Paramètres",      href: "/admin",             icon: Settings,        active: false },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex flex-col h-full bg-[#24221F] text-[#F5EBDD]">

      {/* ── Logo ── */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/8 shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={onClose}>
          <Image
            src="/images/logo.png"
            alt="Cinco Pizza"
            width={36} height={36}
            className="object-contain"
            style={{ width: "auto", height: "36px" }}
          />
          <div>
            <p className="font-display text-sm text-[#F5EBDD] leading-none">Cinco Pizza</p>
            <p className="font-ui text-[0.55rem] text-white/30 uppercase tracking-widest mt-0.5">
              Administration
            </p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-white/40 hover:text-white transition cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="font-ui text-[0.55rem] text-white/25 uppercase tracking-[0.2em] px-3 pb-2">
          Navigation
        </p>
        {NAV.map((item) => {
          const Icon    = item.icon;
          const isCurrent = pathname === item.href && item.label === "Commandes";
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl
                font-ui text-[0.78rem] transition-all duration-150
                ${isCurrent
                  ? "bg-[#C92326] text-white shadow-[0_4px_12px_rgba(201,35,38,0.4)]"
                  : item.active
                    ? "text-white/70 hover:bg-white/8 hover:text-white"
                    : "text-white/30 cursor-not-allowed"
                }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
              {!item.active && (
                <span className="ml-auto font-ui text-[0.55rem] text-white/20 uppercase tracking-wider">
                  Bientôt
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-3 py-4 border-t border-white/8 space-y-1 shrink-0">
        {/* Restaurant status */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5">
          <Circle className="h-2.5 w-2.5 fill-[#168653] text-[#168653]" />
          <span className="font-ui text-[0.72rem] text-white/60">Restaurant</span>
          <span className="ml-auto font-ui text-[0.65rem] text-[#4ade80] font-500">Ouvert</span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl">
          <div className="w-7 h-7 rounded-full bg-[#C92326] flex items-center justify-center shrink-0">
            <span className="font-ui text-[0.65rem] text-white font-700">A</span>
          </div>
          <div className="min-w-0">
            <p className="font-ui text-[0.72rem] text-white/80 leading-none">Admin</p>
            <p className="font-ui text-[0.6rem] text-white/30 mt-0.5">Cinco Pizza</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
            font-ui text-[0.75rem] text-white/40 hover:text-[#C92326]
            hover:bg-[#C92326]/8 transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0EBE3] flex">

      {/* ── Desktop Sidebar (fixed) ── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main area ── */}
      <div className="flex-1 lg:ml-64 min-w-0">

        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 h-14
          bg-[#24221F] border-b border-white/8 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-white/50 hover:text-white transition cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Image src="/images/logo.png" alt="Cinco Pizza" width={28} height={28}
            className="object-contain" style={{ height: "28px", width: "auto" }} />
          <span className="font-display text-sm text-white">Admin</span>
        </div>

        {children}
      </div>
    </div>
  );
}
