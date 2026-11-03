"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Check, ShoppingBag } from "lucide-react";
import { useCartStore, type CartSize } from "@/store/cartStore";
import type { Pizza } from "@/data/pizzas";

/* ── Extra toppings pool ──────────────────────────────────── */
const EXTRA_TOPPINGS = [
  "Mozzarella supplémentaire",
  "Champignons",
  "Poivrons",
  "Oignons rouges",
  "Olives noires",
  "Jalapeños",
  "Maïs",
  "Câpres",
  "Ail",
  "Piment",
];

interface Props {
  pizza: Pizza | null;
  onClose: () => void;
}

export default function PizzaCustomizeModal({ pizza, onClose }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const [size,        setSize]        = useState<CartSize>("senior");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [qty,         setQty]         = useState(1);
  const [added,       setAdded]       = useState(false);

  /* Reset state whenever a new pizza is opened */
  useEffect(() => {
    if (pizza) {
      setIngredients([...pizza.ingredients]);
      setSize("senior");
      setQty(1);
      setAdded(false);
    }
  }, [pizza]);

  if (!pizza) return null;

  const price    = size === "senior" ? pizza.priceSenior : pizza.priceMega;
  const totalLine = price * qty;

  function toggleIngredient(ing: string) {
    setIngredients((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  }

  function handleAdd() {
    if (!pizza) return;
    addItem({
      pizzaId:     pizza.id,
      name:        pizza.name,
      image:       pizza.image,
      size,
      price,
      ingredients,
    });
    // add qty - 1 more times (addItem always adds 1)
    for (let i = 1; i < qty; i++) {
      addItem({ pizzaId: pizza.id, name: pizza.name, image: pizza.image, size, price, ingredients });
    }
    setAdded(true);
    setTimeout(onClose, 800);
  }

  /* All unique ingredients: base + extras that are currently selected */
  const baseIngredients = pizza.ingredients;
  const availableExtras = EXTRA_TOPPINGS.filter((e) => !baseIngredients.includes(e));

  return (
    <AnimatePresence>
      {pizza && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-[#24221F]/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-x-3 bottom-3 top-3 sm:inset-auto sm:top-1/2 sm:left-1/2
              sm:-translate-x-1/2 sm:-translate-y-1/2
              sm:w-[560px] sm:max-h-[90vh]
              z-[90] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* ── Header image ── */}
            <div className="relative h-44 sm:h-52 shrink-0">
              <Image
                src={pizza.image}
                alt={pizza.name}
                fill
                className="object-cover"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90
                  backdrop-blur flex items-center justify-center text-[#24221F]
                  hover:bg-white transition cursor-pointer shadow-md"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Name overlay */}
              <div className="absolute bottom-4 left-5">
                <h2 className="font-display text-2xl text-[#24221F]">{pizza.name}</h2>
                <p className="font-ui text-xs text-[#6B5F52] mt-0.5">{pizza.categoryLabel}</p>
              </div>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

              {/* Size */}
              <div>
                <h3 className="font-ui text-[0.65rem] uppercase tracking-[0.2em] text-[#8C7B6A] mb-3">
                  Choisir la taille
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {(["senior", "mega"] as CartSize[]).map((s) => {
                    const p = s === "senior" ? pizza.priceSenior : pizza.priceMega;
                    const label = s === "senior" ? "Senior" : "Méga";
                    const sub   = s === "senior" ? "Taille normale" : "Grande taille";
                    return (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`relative rounded-xl border-2 p-4 text-left transition-all cursor-pointer
                          ${size === s
                            ? "border-[#C92326] bg-[#FEF0F0]"
                            : "border-[#E2D5C3] bg-[#F9F5EF] hover:border-[#C92326]/40"
                          }`}
                      >
                        {size === s && (
                          <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#C92326]
                            flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-white" />
                          </span>
                        )}
                        <div className="font-ui font-700 text-sm text-[#24221F]">{label}</div>
                        <div className="font-ui text-[0.65rem] text-[#8C7B6A] mt-0.5">{sub}</div>
                        <div className="font-display text-lg text-[#C92326] mt-2 leading-none">{p} €</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Base ingredients */}
              <div>
                <h3 className="font-ui text-[0.65rem] uppercase tracking-[0.2em] text-[#8C7B6A] mb-3">
                  Ingrédients de base — décochez pour retirer
                </h3>
                <div className="flex flex-wrap gap-2">
                  {baseIngredients.map((ing) => {
                    const active = ingredients.includes(ing);
                    return (
                      <button
                        key={ing}
                        onClick={() => toggleIngredient(ing)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
                          font-ui text-[0.72rem] font-500 border transition-all cursor-pointer
                          ${active
                            ? "bg-[#24221F] border-[#24221F] text-white"
                            : "bg-white border-[#E2D5C3] text-[#8C7B6A] line-through opacity-50"
                          }`}
                      >
                        {active && <Check className="h-2.5 w-2.5" />}
                        {ing}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Extra toppings */}
              <div>
                <h3 className="font-ui text-[0.65rem] uppercase tracking-[0.2em] text-[#8C7B6A] mb-3">
                  Ajouter des ingrédients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {availableExtras.map((ing) => {
                    const active = ingredients.includes(ing);
                    return (
                      <button
                        key={ing}
                        onClick={() => toggleIngredient(ing)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
                          font-ui text-[0.72rem] font-500 border transition-all cursor-pointer
                          ${active
                            ? "bg-[#526344] border-[#526344] text-white"
                            : "bg-white border-dashed border-[#D9A441]/60 text-[#8C7B6A] hover:border-[#526344]/50"
                          }`}
                      >
                        {active ? <Check className="h-2.5 w-2.5" /> : <Plus className="h-2.5 w-2.5" />}
                        {ing}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recap */}
              {ingredients.length > 0 && (
                <div className="bg-[#F9F5EF] rounded-xl p-4 text-xs text-[#6B5F52] font-ui leading-relaxed">
                  <span className="font-700 text-[#24221F]">Votre pizza : </span>
                  {ingredients.join(", ")}
                </div>
              )}
            </div>

            {/* ── Footer: qty + CTA ── */}
            <div className="shrink-0 px-5 py-4 border-t border-[#F0E8DC] bg-white">
              <div className="flex items-center gap-4">

                {/* Quantity */}
                <div className="flex items-center gap-3 bg-[#F9F5EF] rounded-full px-3 py-2">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center
                      text-[#24221F] shadow-sm hover:bg-[#F0E8DC] transition cursor-pointer"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="font-ui font-700 text-[#24221F] w-4 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-6 h-6 rounded-full bg-[#C92326] flex items-center justify-center
                      text-white shadow-sm hover:bg-[#A91D20] transition cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Add to cart */}
                <motion.button
                  onClick={handleAdd}
                  disabled={added || ingredients.length === 0}
                  animate={added ? { scale: [1, 1.04, 1] } : {}}
                  className={`flex-1 flex items-center justify-between px-5 py-3 rounded-full
                    font-ui font-700 text-sm transition-all cursor-pointer
                    ${added
                      ? "bg-[#526344] text-white"
                      : "bg-[#C92326] text-white hover:bg-[#A91D20] active:scale-[0.98]"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-[0_4px_16px_rgba(201,35,38,0.3)]`}
                >
                  <span className="flex items-center gap-2">
                    {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                    {added ? "Ajouté !" : "Ajouter au panier"}
                  </span>
                  <span className="font-display text-base">{totalLine.toFixed(2)} €</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
