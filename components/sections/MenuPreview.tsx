"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pizzas, type Pizza, type PizzaCategory } from "@/data/pizzas";
import PizzaCustomizeModal from "@/components/cart/PizzaCustomizeModal";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type FilterId = "all" | PizzaCategory;

const filters: { id: FilterId; label: string }[] = [
  { id: "all",    label: "Toutes" },
  { id: "tomate", label: "Tomate" },
  { id: "creme",  label: "Crème" },
  { id: "bbq",    label: "BBQ" },
  { id: "curry",  label: "Curry" },
];

const catBadge: Record<PizzaCategory, string> = {
  tomate: "cat-tomate",
  creme:  "cat-creme",
  bbq:    "cat-bbq",
  curry:  "cat-curry",
};

const catLabel: Record<PizzaCategory, string> = {
  tomate: "Tomate",
  creme:  "Crème",
  bbq:    "BBQ",
  curry:  "Curry",
};

function PizzaCard({ pizza, index, onCustomize }: { pizza: Pizza; index: number; onCustomize: (p: Pizza) => void }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.28), ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden card-shadow
        border border-[#EDE3D3] hover:border-[#C92326]/20"
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-[#F5EBDD] img-zoom">
        <Image
          src={pizza.image} alt={pizza.name} fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
          sizes="(max-width:640px) 50vw, (max-width:1024px) 50vw, 33vw"
        />
        {pizza.badge && <span className="red-tag absolute top-2 left-2 text-[0.55rem]">{pizza.badge}</span>}
        <span className={`absolute top-2 right-2 text-[0.55rem] sm:text-[10px] font-ui font-600
          uppercase tracking-wide px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${catBadge[pizza.category]}`}>
          {catLabel[pizza.category]}
        </span>
      </div>

      <div className="p-3 sm:p-5">
        <h3 className="font-display text-sm sm:text-[1.05rem] text-[#24221F] mb-1
          group-hover:text-[#C92326] transition-colors duration-200 leading-tight">
          {pizza.name}
        </h3>
        <p className="text-[#8C7B6A] text-[0.65rem] sm:text-xs leading-relaxed mb-3 line-clamp-1 sm:line-clamp-2 font-sans">
          {pizza.ingredients.join(", ")}
        </p>
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#F0E8DC]">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="price-pill price-senior text-[0.65rem] sm:text-[0.78rem] px-2 py-0.5 sm:px-3 sm:py-1">
              {pizza.priceSenior}€
            </span>
            <span className="price-pill price-mega text-[0.65rem] sm:text-[0.78rem] px-2 py-0.5 sm:px-3 sm:py-1">
              {pizza.priceMega}€
            </span>
          </div>
          <button
            onClick={() => onCustomize(pizza)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C92326] text-white flex items-center justify-center
              hover:bg-[#A91D20] transition-colors shadow-[0_2px_8px_rgba(201,35,38,0.3)] cursor-pointer shrink-0"
            aria-label={`Ajouter ${pizza.name}`}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function MenuPreview() {
  const [active, setActive] = useState<FilterId>("all");
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const visible = active === "all" ? pizzas : pizzas.filter((p) => p.category === active);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".menu-header", {
        opacity: 0, y: 20, duration: 0.55, ease: "power2.out",
        scrollTrigger: { trigger: ".menu-header", start: "top 88%", toggleActions: "play none none none" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="menu" ref={sectionRef} className="bg-[#F5EBDD] section-py">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-6 lg:px-10">

          {/* Header */}
          <div className="menu-header flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 lg:mb-10">
            <div>
              <span className="overline text-[#C92326] block mb-3">Notre carte</span>
              <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] text-[#24221F]">
                {visible.length} pizzas artisanales.
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-ui text-xs text-[#6B5F52]">
                <span className="w-2 h-2 rounded-full bg-[#C92326] shrink-0" />
                Senior dès <strong className="text-[#24221F] ml-1">9 €</strong>
              </span>
              <span className="flex items-center gap-1.5 font-ui text-xs text-[#6B5F52]">
                <span className="w-2 h-2 rounded-full bg-[#D9A441] shrink-0" />
                Méga dès <strong className="text-[#24221F] ml-1">14 €</strong>
              </span>
            </div>
          </div>

          {/* Filters — horizontally scrollable on mobile */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`shrink-0 px-4 sm:px-5 py-2 rounded-full font-ui text-[0.7rem] sm:text-[0.72rem]
                  font-600 tracking-wide border transition-all duration-200 cursor-pointer
                  ${active === f.id
                    ? "bg-[#C92326] border-[#C92326] text-white shadow-[0_4px_16px_rgba(201,35,38,0.25)]"
                    : "bg-white border-[#E2D5C3] text-[#6B5F52] hover:border-[#C92326]/40"
                  }`}
              >
                {f.label}
                {f.id === "all" && (
                  <span className={`ml-1 text-[0.6rem] ${active === f.id ? "opacity-70" : "opacity-50"}`}>(39)</span>
                )}
              </button>
            ))}
          </div>

          {/* Grid — 2 cols on mobile, 2 on tablet, 3 on desktop */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
            >
              {visible.map((pizza, i) => (
                <PizzaCard key={pizza.id} pizza={pizza} index={i} onCustomize={setSelectedPizza} />
              ))}
            </motion.div>
          </AnimatePresence>

          <p className="mt-6 text-center text-[0.65rem] sm:text-xs text-[#8C7B6A] font-ui">
            * Saumon : <strong className="text-[#24221F]">10 €</strong> / <strong className="text-[#24221F]">15 €</strong>.
            {" "}Autres pizzas : <strong className="text-[#24221F]">9 €</strong> / <strong className="text-[#24221F]">14 €</strong>.
          </p>
        </div>
      </section>

      <PizzaCustomizeModal pizza={selectedPizza} onClose={() => setSelectedPizza(null)} />
    </>
  );
}
