"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Clock, Loader2, ChefHat,
  CheckCheck, Bell, ShoppingBag, TrendingUp,
  Banknote, Pizza, ChevronRight, Phone, MapPin,
  Building2, MessageSquare, Truck, KeyRound, AlertCircle,
} from "lucide-react";
import type { Order } from "@/lib/orders";

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
function elapsed(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)   return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)} min`;
  return `${Math.floor(s / 3600)}h`;
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
function useToday() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    setLabel(new Date().toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long",
    }));
  }, []);
  return label;
}

/* ═══════════════════════════════════════════════════════════════
   KPI CARD
═══════════════════════════════════════════════════════════════ */
function KpiCard({
  icon: Icon, label, value, sub, color, alert,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub: string;
  color: string;   // tailwind bg class for icon bg
  alert?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white rounded-2xl p-5 border transition-shadow duration-300
        ${alert
          ? "border-[#C92326]/25 shadow-[0_0_0_1px_rgba(201,35,38,0.1),0_4px_20px_rgba(201,35,38,0.08)]"
          : "border-[#E2D5C3] shadow-[0_1px_4px_rgba(36,34,31,0.06)] hover:shadow-[0_4px_16px_rgba(36,34,31,0.1)]"
        }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {alert && (
          <span className="flex items-center gap-1 bg-[#C92326]/10 text-[#C92326]
            font-ui text-[0.6rem] uppercase tracking-wider px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C92326] animate-pulse" />
            Nouveau
          </span>
        )}
      </div>
      <p className="font-display text-3xl text-[#24221F] leading-none mb-1">{value}</p>
      <p className="font-ui text-[0.72rem] text-[#6B5F52] font-500">{label}</p>
      <p className="font-ui text-[0.6rem] text-[#8C7B6A] mt-0.5">{sub}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ORDER CARD
═══════════════════════════════════════════════════════════════ */
const STATUS_CFG = {
  "nouveau": {
    label:  "Nouveau",
    badge:  "bg-[#FEF0F0] text-[#C92326] border border-[#C92326]/20",
    dot:    "bg-[#C92326]",
    pulse:  true,
  },
  "en préparation": {
    label:  "En préparation",
    badge:  "bg-[#FFFBEB] text-[#B45309] border border-[#D9A441]/30",
    dot:    "bg-[#D9A441]",
    pulse:  false,
  },
  "en livraison": {
    label:  "En livraison",
    badge:  "bg-[#EFF6FF] text-[#1D4ED8] border border-[#3B82F6]/20",
    dot:    "bg-[#3B82F6]",
    pulse:  true,
  },
  "terminé": {
    label:  "Terminé",
    badge:  "bg-[#F0FDF4] text-[#168653] border border-[#168653]/20",
    dot:    "bg-[#168653]",
    pulse:  false,
  },
} as const;

function OrderCard({
  order, updating, onStatus, onConfirmDelivery,
}: {
  order: Order;
  updating: boolean;
  onStatus: (id: string, s: Order["status"]) => void;
  onConfirmDelivery: (id: string, code: string) => Promise<boolean>;
}) {
  const cfg      = STATUS_CFG[order.status];
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);
  const done     = order.status === "terminé";

  const [codeInput,  setCodeInput]  = useState("");
  const [codeError,  setCodeError]  = useState("");
  const [confirming, setConfirming] = useState(false);

  async function handleConfirm() {
    if (!codeInput.trim()) return;
    setConfirming(true);
    setCodeError("");
    const ok = await onConfirmDelivery(order.id, codeInput.trim());
    if (!ok) setCodeError("Code incorrect. Réessayez.");
    setConfirming(false);
    if (ok) setCodeInput("");
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl border overflow-hidden
        shadow-[0_1px_4px_rgba(36,34,31,0.06)]
        hover:shadow-[0_4px_16px_rgba(36,34,31,0.1)]
        transition-shadow duration-300
        ${done ? "border-[#E2D5C3] opacity-70" : "border-[#E2D5C3]"}`}
    >
      {/* Coloured top line */}
      <div className={`h-[3px] w-full ${
        order.status === "nouveau"        ? "bg-[#C92326]" :
        order.status === "en préparation" ? "bg-[#D9A441]" :
        order.status === "en livraison"   ? "bg-[#3B82F6]" :
        "bg-[#168653]"
      }`} />

      <div className="p-4">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-ui text-sm font-700 text-[#24221F]">
                #{order.id}
              </span>
              <span className={`inline-flex items-center gap-1 font-ui
                text-[0.6rem] uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`} />
                {cfg.label}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#8C7B6A]">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="font-ui text-[0.65rem]">
                {fmtTime(order.createdAt)} · il y a {elapsed(order.createdAt)}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-xl text-[#C92326] leading-none">
              {order.total.toFixed(2)} €
            </p>
            <p className="font-ui text-[0.6rem] text-[#8C7B6A] mt-0.5">
              {totalQty} art.
            </p>
          </div>
        </div>

        {/* ── Items ── */}
        <div className="space-y-2 mb-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-[#F9F5EF]
              rounded-xl p-2.5 border border-[#EDE3D3]">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                <Image src={item.image} alt={item.name}
                  fill className="object-cover" sizes="40px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-ui text-[0.78rem] text-[#24221F] font-600 leading-tight">
                    {item.name}
                  </span>
                  <span className={`font-ui text-[0.58rem] font-600 uppercase px-1.5 py-0.5
                    rounded-full ${item.size === "senior" ? "bg-[#FEF0F0] text-[#C92326]" : "bg-[#FBF5E8] text-[#8A6420]"}`}>
                    {item.size === "senior" ? "Senior" : "Méga"} ×{item.quantity}
                  </span>
                </div>
                <p className="font-ui text-[0.6rem] text-[#8C7B6A] truncate mt-0.5">
                  {item.ingredients.join(", ")}
                </p>
              </div>
              <span className="font-ui text-[0.78rem] font-600 text-[#24221F] shrink-0">
                {(item.price * item.quantity).toFixed(2)} €
              </span>
            </div>
          ))}
        </div>

        {/* ── Customer info ── */}
        {order.customer && (
          <div className="bg-[#F9F5EF] rounded-xl p-3 mb-3 border border-[#EDE3D3] space-y-1.5">
            <p className="font-ui text-[0.6rem] font-700 uppercase tracking-wider text-[#8C7B6A] mb-2">
              Client
            </p>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-3 w-3 text-[#8C7B6A] shrink-0" />
              <span className="font-ui text-[0.75rem] font-600 text-[#24221F]">{order.customer.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-[#8C7B6A] shrink-0" />
              <a href={`tel:${order.customer.phone}`}
                className="font-ui text-[0.73rem] text-[#C92326] hover:underline">
                {order.customer.phone}
              </a>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-3 w-3 text-[#8C7B6A] shrink-0 mt-0.5" />
              <span className="font-ui text-[0.73rem] text-[#24221F]">{order.customer.address}</span>
            </div>
            {order.customer.floor && (
              <div className="flex items-center gap-2">
                <Building2 className="h-3 w-3 text-[#8C7B6A] shrink-0" />
                <span className="font-ui text-[0.73rem] text-[#24221F]">{order.customer.floor}</span>
              </div>
            )}
            {order.customer.note && (
              <div className="flex items-start gap-2">
                <MessageSquare className="h-3 w-3 text-[#8C7B6A] shrink-0 mt-0.5" />
                <span className="font-ui text-[0.7rem] text-[#6B5F52] italic">{order.customer.note}</span>
              </div>
            )}
          </div>
        )}

        {/* Payment note */}
        <div className="flex items-center gap-1.5 mb-3 pb-3 border-b border-[#F0E8DC]">
          <Banknote className="h-3 w-3 text-[#8C7B6A]" />
          <span className="font-ui text-[0.62rem] text-[#8C7B6A]">Espèces à la livraison</span>
        </div>

        {/* ── Action button ── */}
        {updating ? (
          <div className="flex items-center gap-2 text-[#8C7B6A] font-ui text-xs py-0.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Mise à jour...
          </div>
        ) : order.status === "nouveau" ? (
          <button
            onClick={() => onStatus(order.id, "en préparation")}
            className="w-full flex items-center justify-center gap-2
              bg-[#D9A441]/10 hover:bg-[#D9A441]/20
              text-[#B45309] border border-[#D9A441]/30
              font-ui text-[0.72rem] font-600 rounded-xl py-2.5
              transition-all duration-200 cursor-pointer group"
          >
            <ChefHat className="h-3.5 w-3.5" />
            Mettre en préparation
            <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition" />
          </button>
        ) : order.status === "en préparation" ? (
          <button
            onClick={() => onStatus(order.id, "en livraison")}
            className="w-full flex items-center justify-center gap-2
              bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20
              text-[#1D4ED8] border border-[#3B82F6]/20
              font-ui text-[0.72rem] font-600 rounded-xl py-2.5
              transition-all duration-200 cursor-pointer group"
          >
            <Truck className="h-3.5 w-3.5" />
            Partir en livraison
            <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition" />
          </button>
        ) : order.status === "en livraison" ? (
          <div className="space-y-2">
            <p className="font-ui text-[0.65rem] text-[#1D4ED8] flex items-center gap-1.5">
              <KeyRound className="h-3 w-3" />
              Entrez le code du client pour confirmer la livraison
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={4}
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value.replace(/\D/, "")); setCodeError(""); }}
                placeholder="0000"
                className="flex-1 bg-white border border-[#E2D5C3] rounded-xl px-3 py-2.5
                  font-display text-xl text-center text-[#24221F] tracking-[0.3em]
                  focus:outline-none focus:border-[#168653] focus:ring-1 focus:ring-[#168653]/20
                  transition"
              />
              <button
                onClick={handleConfirm}
                disabled={confirming || codeInput.length < 4}
                className="flex items-center justify-center gap-1.5 px-4
                  bg-[#168653]/10 hover:bg-[#168653]/20
                  text-[#168653] border border-[#168653]/20
                  font-ui text-[0.72rem] font-600 rounded-xl
                  transition-all duration-200 cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {confirming
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <CheckCheck className="h-3.5 w-3.5" />
                }
                OK
              </button>
            </div>
            {codeError && (
              <p className="font-ui text-[0.65rem] text-[#C92326] flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />{codeError}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[#168653] font-ui text-[0.72rem] py-0.5">
            <CheckCheck className="h-3.5 w-3.5" />
            Commande terminée
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COLUMN
═══════════════════════════════════════════════════════════════ */
function Column({
  title, count, dot, dotPulse, children, emptyMsg,
}: {
  title: string;
  count: number;
  dot: string;
  dotPulse?: boolean;
  children: React.ReactNode;
  emptyMsg: string;
}) {
  return (
    <div className="flex flex-col min-h-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={`w-2 h-2 rounded-full shrink-0 ${dot} ${dotPulse ? "animate-pulse" : ""}`} />
        <h3 className="font-ui text-[0.72rem] font-600 text-[#24221F] uppercase tracking-[0.12em]">
          {title}
        </h3>
        <span className="ml-auto font-ui text-[0.65rem] text-[#8C7B6A] bg-[#EDE3D3]
          px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      <div className="space-y-3 flex-1">
        <AnimatePresence>
          {count === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-3
                bg-white/60 border-2 border-dashed border-[#E2D5C3]
                rounded-2xl py-10 text-center"
            >
              <ShoppingBag className="h-6 w-6 text-[#C9B9A8]" />
              <p className="font-ui text-[0.72rem] text-[#8C7B6A]">{emptyMsg}</p>
            </motion.div>
          ) : children}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SKELETON
═══════════════════════════════════════════════════════════════ */
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-[#EDE3D3] animate-pulse rounded-xl ${className}`} />
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[0, 1, 2].map((col) => (
        <div key={col} className="space-y-3">
          <Skeleton className="h-5 w-32" />
          {[0, 1].map((c) => (
            <div key={c} className="bg-white rounded-2xl border border-[#E2D5C3] p-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function AdminPage() {
  const router = useRouter();
  const [orders,     setOrders]     = useState<Order[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating,   setUpdating]   = useState<string | null>(null);
  /* Mobile tab: 0=nouveau 1=prépa 2=terminé */
  const [tab, setTab] = useState(0);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/orders");
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOrders();
    const id = setInterval(() => fetchOrders(true), 15_000);
    return () => clearInterval(id);
  }, [fetchOrders]);

  async function handleStatus(orderId: string, status: Order["status"]) {
    setUpdating(orderId);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    } finally {
      setUpdating(null);
    }
  }

  async function handleConfirmDelivery(orderId: string, code: string): Promise<boolean> {
    const res = await fetch(`/api/orders/${orderId}/confirm`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ code }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, status: "terminé" } : o)
      );
      return true;
    }
    return false;
  }

  /* Computed */
  const nouveau       = orders.filter((o) => o.status === "nouveau");
  const enPreparation = orders.filter((o) => o.status === "en préparation");
  const enLivraison   = orders.filter((o) => o.status === "en livraison");
  const termine       = orders.filter((o) => o.status === "terminé");
  const revenue       = orders.reduce((s, o) => s + o.total, 0);
  const hasNew        = nouveau.length > 0;
  const dateLabel     = useToday();

  const TABS = [
    { label: "Nouvelles",   count: nouveau.length,       color: "text-[#C92326]" },
    { label: "En prépa",    count: enPreparation.length, color: "text-[#B45309]" },
    { label: "Livraison",   count: enLivraison.length,   color: "text-[#1D4ED8]" },
    { label: "Terminées",   count: termine.length,       color: "text-[#168653]" },
  ];

  const tabOrders = [nouveau, enPreparation, enLivraison, termine][tab];

  return (
    <div className="min-h-screen bg-[#F0EBE3]">

      {/* ══ TOPBAR ══════════════════════════════════════════════ */}
      <div className="bg-white border-b border-[#E2D5C3] sticky top-0 lg:top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

          {/* Title + date */}
          <div className="hidden lg:flex items-center gap-4">
            <div>
              <h1 className="font-display text-base text-[#24221F] leading-none">Commandes</h1>
              <p className="font-ui text-[0.6rem] text-[#8C7B6A] mt-0.5 capitalize">{dateLabel}</p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* New orders bell */}
            {hasNew && (
              <div className="hidden sm:flex items-center gap-1.5 bg-[#FEF0F0]
                border border-[#C92326]/20 rounded-full px-3 py-1.5">
                <Bell className="h-3 w-3 text-[#C92326] animate-pulse" />
                <span className="font-ui text-[0.65rem] text-[#C92326]">
                  {nouveau.length} nouvelle{nouveau.length > 1 ? "s" : ""}
                </span>
              </div>
            )}

            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                font-ui text-[0.72rem] text-[#6B5F52] hover:text-[#24221F]
                hover:bg-[#F0E8DC] border border-[#E2D5C3]
                transition cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ══ KPI CARDS ═══════════════════════════════════════ */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4">
          <KpiCard
            icon={ShoppingBag}
            label="Total commandes"
            value={orders.length}
            sub="ce service"
            color="bg-[#24221F]"
          />
          <KpiCard
            icon={Bell}
            label="Nouvelles"
            value={nouveau.length}
            sub="à traiter"
            color="bg-[#C92326]"
            alert={hasNew}
          />
          <KpiCard
            icon={ChefHat}
            label="En préparation"
            value={enPreparation.length}
            sub="en cuisine"
            color="bg-[#D9A441]"
          />
          <KpiCard
            icon={Truck}
            label="En livraison"
            value={enLivraison.length}
            sub="en route"
            color="bg-[#3B82F6]"
          />
          <KpiCard
            icon={TrendingUp}
            label="Chiffre d'affaires"
            value={`${revenue.toFixed(2)} €`}
            sub="total du service"
            color="bg-[#168653]"
          />
        </div>

        {/* ══ ORDER BOARD ══════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-[#E2D5C3]
          shadow-[0_1px_4px_rgba(36,34,31,0.06)] overflow-hidden">

          {/* Board header */}
          <div className="flex items-center justify-between px-5 py-4
            border-b border-[#F0E8DC]">
            <div className="flex items-center gap-2">
              <Pizza className="h-4 w-4 text-[#C92326]" />
              <h2 className="font-ui text-sm font-600 text-[#24221F]">Gestion des commandes</h2>
            </div>
            <span className="font-ui text-[0.65rem] text-[#8C7B6A] bg-[#F0E8DC]
              px-2.5 py-1 rounded-full">
              {orders.length} commande{orders.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="p-4 sm:p-5">

            {loading ? <LoadingState /> : (
              <>
                {/* ── Desktop 4-column grid ── */}
                <div className="hidden md:grid grid-cols-4 gap-4">
                  <Column
                    title="Nouvelles commandes"
                    count={nouveau.length}
                    dot="bg-[#C92326]"
                    dotPulse={hasNew}
                    emptyMsg="Aucune nouvelle commande"
                  >
                    {nouveau.map((o) => (
                      <OrderCard key={o.id} order={o}
                        updating={updating === o.id}
                        onStatus={handleStatus}
                        onConfirmDelivery={handleConfirmDelivery} />
                    ))}
                  </Column>

                  <Column
                    title="En préparation"
                    count={enPreparation.length}
                    dot="bg-[#D9A441]"
                    emptyMsg="Aucune commande en cours"
                  >
                    {enPreparation.map((o) => (
                      <OrderCard key={o.id} order={o}
                        updating={updating === o.id}
                        onStatus={handleStatus}
                        onConfirmDelivery={handleConfirmDelivery} />
                    ))}
                  </Column>

                  <Column
                    title="En livraison"
                    count={enLivraison.length}
                    dot="bg-[#3B82F6]"
                    dotPulse={enLivraison.length > 0}
                    emptyMsg="Aucune commande en livraison"
                  >
                    {enLivraison.map((o) => (
                      <OrderCard key={o.id} order={o}
                        updating={updating === o.id}
                        onStatus={handleStatus}
                        onConfirmDelivery={handleConfirmDelivery} />
                    ))}
                  </Column>

                  <Column
                    title="Terminées"
                    count={termine.length}
                    dot="bg-[#168653]"
                    emptyMsg="Aucune commande terminée"
                  >
                    {termine.map((o) => (
                      <OrderCard key={o.id} order={o}
                        updating={updating === o.id}
                        onStatus={handleStatus}
                        onConfirmDelivery={handleConfirmDelivery} />
                    ))}
                  </Column>
                </div>

                {/* ── Mobile tabs ── */}
                <div className="md:hidden">
                  {/* Tab switcher */}
                  <div className="flex gap-1 p-1 bg-[#F0E8DC] rounded-xl mb-4">
                    {TABS.map((t, i) => (
                      <button
                        key={t.label}
                        onClick={() => setTab(i)}
                        className={`flex-1 flex items-center justify-center gap-1.5
                          font-ui text-[0.7rem] font-600 py-2 rounded-lg
                          transition-all duration-150 cursor-pointer
                          ${tab === i
                            ? "bg-white shadow-sm text-[#24221F]"
                            : "text-[#8C7B6A] hover:text-[#24221F]"
                          }`}
                      >
                        {t.label}
                        {t.count > 0 && (
                          <span className={`text-[0.6rem] font-700 ${tab === i ? t.color : "text-[#8C7B6A]"}`}>
                            {t.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Mobile column content */}
                  <div className="space-y-3">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={tab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        {tabOrders.length === 0 ? (
                          <div className="flex flex-col items-center gap-3
                            border-2 border-dashed border-[#E2D5C3]
                            rounded-2xl py-10 text-center">
                            <ShoppingBag className="h-6 w-6 text-[#C9B9A8]" />
                            <p className="font-ui text-[0.72rem] text-[#8C7B6A]">
                              {[
                                "Aucune nouvelle commande",
                                "Aucune commande en cours",
                                "Aucune commande en livraison",
                                "Aucune commande terminée",
                              ][tab]}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {tabOrders.map((o) => (
                              <OrderCard key={o.id} order={o}
                                updating={updating === o.id}
                                onStatus={handleStatus}
                                onConfirmDelivery={handleConfirmDelivery} />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="font-ui text-[0.6rem] text-[#8C7B6A]/50 text-center pb-2">
          Actualisation automatique toutes les 15 secondes
        </p>
      </div>
    </div>
  );
}
