"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Check, ShoppingBag, GlassWater } from "lucide-react";
import { useCartStore, type CartSize } from "@/store/cartStore";
import { pizzas } from "@/data/pizzas";

export const PACKS: Record<CartSize, { label: string; price: number }> = {
  senior: { label: "Pack Senior", price: 23 },
  mega:   { label: "Pack Méga",   price: 33 },
};

const PACK_SIZE = 2;

interface Props {
  size: CartSize | null;
  onClose: () => void;
}

export default function PackModal({ size, onClose }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const [picked, setPicked] = useState<string[]>([]); // pizza ids (duplicates allowed)
  const [added,  setAdded]  = useState(false);

  useEffect(() => {
    if (size) { setPicked([]); setAdded(false); }
  }, [size]);

  if (!size) return null;

  const pack = PACKS[size];
  const full = picked.length >= PACK_SIZE;

  function pick(id: string) {
    setPicked((prev) => (prev.length >= PACK_SIZE ? prev : [...prev, id]));
  }
  function unpick(index: number) {
    setPicked((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAdd() {
    if (!full || !size) return;
    const chosen = picked.map((id) => pizzas.find((p) => p.id === id)!);
    addItem({
      pizzaId:     `pack-${size}`,
      name:        `${pack.label} (2 pizzas + boisson)`,
      image:       chosen[0].image,
      size,
      price:       pack.price,
      ingredients: [...chosen.map((p) => p.name), "1 Maxi Boisson"],
    });
    setAdded(true);
    setTimeout(onClose, 800);
  }

  const countOf = (id: string) => picked.filter((p) => p === id).length;

  return (
    <AnimatePresence>
      <motion.div
        key="pack-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-[#24221F]/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="pack-modal"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 380, damping: 36 }}
        className="fixed inset-x-3 bottom-3 top-3 sm:inset-auto sm:top-1/2 sm:left-1/2
          sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[600px] sm:max-h-[90vh]
          z-[90] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="shrink-0 px-5 py-4 border-b border-[#F0E8DC] flex items-start justify-between gap-3">
          <div>
            <p className="font-ui text-[0.62rem] uppercase tracking-[0.25em] text-[#C92326]">{pack.label}</p>
            <h2 className="font-display text-xl text-[#24221F] leading-tight">
              Choisissez {PACK_SIZE} pizzas {size === "senior" ? "Senior" : "Méga"}
            </h2>
            <p className="font-ui text-xs text-[#8C7B6A] mt-1 flex items-center gap-1.5">
              <GlassWater className="h-3 w-3" /> 1 Maxi Boisson incluse · {pack.price} €
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F9F5EF] flex items-center justify-center
              text-[#24221F] hover:bg-[#EDE3D3] transition cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Selected slots */}
        <div className="shrink-0 px-5 py-3 grid grid-cols-2 gap-3 bg-[#F9F5EF] border-b border-[#F0E8DC]">
          {Array.from({ length: PACK_SIZE }).map((_, i) => {
            const p = picked[i] ? pizzas.find((x) => x.id === picked[i]) : null;
            return (
              <div key={i}
                className={`rounded-xl border-2 px-3 py-2 flex items-center gap-2 min-h-[48px]
                  ${p ? "border-[#C92326] bg-white" : "border-dashed border-[#D9C4AA] text-[#8C7B6A]"}`}>
                {p ? (
                  <>
                    <span className="font-ui text-[0.78rem] font-600 text-[#24221F] flex-1 truncate">{p.name}</span>
                    <button onClick={() => unpick(i)} aria-label={`Retirer ${p.name}`}
                      className="text-[#C92326]/60 hover:text-[#C92326] cursor-pointer">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <span className="font-ui text-[0.72rem]">Pizza {i + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Pizza list */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3 content-start auto-rows-min">
          {pizzas.map((p) => {
            const n = countOf(p.id);
            return (
              <button
                key={p.id}
                onClick={() => pick(p.id)}
                disabled={full}
                className={`relative text-left rounded-xl overflow-hidden border-2 transition cursor-pointer self-start
                  disabled:cursor-not-allowed ${n > 0 ? "border-[#C92326]" : "border-[#EDE3D3] hover:border-[#C92326]/40"}
                  ${full && n === 0 ? "opacity-40" : ""}`}
              >
                <div className="relative aspect-[4/3]">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="200px" />
                  {n > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#C92326] text-white
                      font-ui text-[0.65rem] font-700 flex items-center justify-center">
                      {n}
                    </span>
                  )}
                </div>
                <div className="px-2.5 py-2 bg-white flex items-center justify-between gap-1">
                  <span className="font-ui text-[0.72rem] font-600 text-[#24221F] truncate">{p.name}</span>
                  {!full && <Plus className="h-3.5 w-3.5 text-[#C92326] shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-4 border-t border-[#F0E8DC] bg-white">
          <button
            onClick={handleAdd}
            disabled={!full || added}
            className={`w-full flex items-center justify-between px-5 py-3 rounded-full font-ui font-700 text-sm
              transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
              ${added ? "bg-[#526344] text-white" : "bg-[#C92326] text-white hover:bg-[#A91D20]"}`}
          >
            <span className="flex items-center gap-2">
              {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {added ? "Ajouté !" : full ? "Ajouter au panier" : `Encore ${PACK_SIZE - picked.length} pizza${PACK_SIZE - picked.length > 1 ? "s" : ""} à choisir`}
            </span>
            <span className="font-display text-base">{pack.price.toFixed(2)} €</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
