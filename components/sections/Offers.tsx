"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PackModal from "@/components/cart/PackModal";
import type { CartSize } from "@/store/cartStore";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Offers() {
  const sectionRef = useRef<HTMLElement>(null);
  const [packSize, setPackSize] = useState<CartSize | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".offers-heading", {
        opacity: 0, y: 24, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: ".offers-heading", start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.from(".offer-card", {
        opacity: 0, y: 28, duration: 0.5, stagger: 0.12, ease: "back.out(1.4)",
        scrollTrigger: { trigger: ".offer-card", start: "top 85%", toggleActions: "play none none none" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="offres" ref={sectionRef} className="bg-white section-py">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-6 lg:px-10">

        <div className="offers-heading mb-8 lg:mb-12">
          <span className="overline text-[#C92326] block mb-3">Offres spéciales</span>
          <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] text-[#24221F]">
            Packs généreux,{" "}
            <em className="text-[#C92326] not-italic">prix imbattables.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

          {/* Pack Senior */}
          <div className="offer-card relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[280px]
            flex flex-col justify-between p-6 sm:p-8 bg-[#C92326]">
            <div className="relative z-10">
              <span className="font-ui text-white/60 text-[0.58rem] uppercase tracking-[0.3em] font-600 block mb-2">
                Pack Senior
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight mb-1">2 pizzas pour</h3>
              <div className="font-display text-5xl sm:text-[4.5rem] text-white leading-none mb-2 sm:mb-3">23€</div>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-[200px] font-ui hidden sm:block">
                2 pizzas Senior au choix + 1 Maxi Boisson.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 w-[50%] h-full">
              <Image src="/images/pizza-reine.jpg" alt="Pack Senior" fill className="object-cover object-left" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#C92326] to-[#C92326]/0" />
            </div>
            <button type="button" onClick={() => setPackSize("senior")}
              className="relative z-10 mt-4 self-start bg-white text-[#C92326]
                font-ui font-700 text-xs sm:text-sm px-5 py-2.5 rounded-full
                hover:bg-[#F5EBDD] transition-colors cursor-pointer shadow-lg">
              Commander →
            </button>
          </div>

          {/* Pack Méga */}
          <div className="offer-card relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[280px]
            flex flex-col justify-between p-6 sm:p-8 bg-[#24221F]">
            <div className="relative z-10">
              <span className="font-ui text-white/40 text-[0.58rem] uppercase tracking-[0.3em] font-600 block mb-2">
                Pack Méga
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight mb-1">2 pizzas pour</h3>
              <div className="font-display text-5xl sm:text-[4.5rem] text-[#D9A441] leading-none mb-2 sm:mb-3">33€</div>
              <p className="text-white/45 text-xs sm:text-sm leading-relaxed max-w-[200px] font-ui hidden sm:block">
                2 pizzas Méga au choix + 1 Maxi Boisson.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 w-[50%] h-full">
              <Image src="/images/pizza-trois-viandes.jpg" alt="Pack Méga" fill className="object-cover object-left opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#24221F] to-transparent" />
            </div>
            <button type="button" onClick={() => setPackSize("mega")}
              className="relative z-10 mt-4 self-start bg-[#C92326] text-white
                font-ui font-700 text-xs sm:text-sm px-5 py-2.5 rounded-full
                hover:bg-[#A91D20] transition-colors cursor-pointer shadow-lg">
              Commander →
            </button>
          </div>
        </div>

        {/* Boissons */}
        <div className="mt-4 rounded-2xl bg-[#F9F5EF] border border-[#EDE3D3] p-5 sm:p-6">
          <h3 className="font-ui text-[0.65rem] uppercase tracking-[0.25em] text-[#8C7B6A] mb-4">
            🥤 Boissons
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Boisson 33cl", price: "1,50 €" },
              { label: "Boisson 1,5L", price: "3,00 €" },
              { label: "Maxi Boisson", price: "incluse dans les packs" },
            ].map((b) => (
              <div key={b.label} className="bg-white rounded-xl px-4 py-3 border border-[#EDE3D3] flex flex-col gap-1">
                <span className="font-ui text-[0.72rem] text-[#6B5F52]">{b.label}</span>
                <span className="font-display text-lg text-[#C92326]">{b.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Promotions strip */}
        <div className="mt-4 rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/7] sm:aspect-[21/6] relative">
          <Image src="/images/promotions.png" alt="Promotions Cinco Pizza" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24221F]/15 to-transparent" />
        </div>

        <p className="mt-4 text-center text-[0.65rem] sm:text-xs text-[#8C7B6A] font-ui">
          Paiement par carte bancaire ou espèces à la livraison.
        </p>
      </div>

      <PackModal size={packSize} onClose={() => setPackSize(null)} />
    </section>
  );
}
