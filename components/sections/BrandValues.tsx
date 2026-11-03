"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    number: "01",
    title: "Pâte maison",
    body: "Pétrie et façonnée chaque matin dans notre cuisine, sans compromis sur la qualité.",
    accentColor: "#D9A441",
    topBar: "bg-[#D9A441]",
  },
  {
    number: "02",
    title: "Ingrédients frais",
    body: "Produits de qualité livrés chaque jour, sélectionnés avec le plus grand soin.",
    accentColor: "#C92326",
    topBar: "bg-[#C92326]",
  },
  {
    number: "03",
    title: "Garniture généreuse",
    body: "Des pizzas bien garnies pour un rapport qualité-prix imbattable, à chaque commande.",
    accentColor: "#526344",
    topBar: "bg-[#526344]",
  },
  {
    number: "04",
    title: "Livraison rapide",
    body: "Votre pizza chaude et croustillante livrée directement chez vous en 30 minutes.",
    accentColor: "#24221F",
    topBar: "bg-[#24221F]",
  },
];

export default function BrandValues() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".bv-heading", {
        opacity: 0, y: 24, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: ".bv-heading", start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.from(".bv-card", {
        opacity: 0, y: 32, duration: 0.55, stagger: 0.1, ease: "back.out(1.4)",
        scrollTrigger: { trigger: ".bv-grid", start: "top 85%", toggleActions: "play none none none" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="engagements" ref={sectionRef} className="bg-white section-py">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-6 lg:px-10">

        {/* Heading row */}
        <div className="bv-heading flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10 lg:mb-14">
          <div>
            <span className="overline text-[#C92326] block mb-3">Nos engagements</span>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] text-[#24221F] max-w-md">
              Qualité artisanale,{" "}
              <em className="text-[#C92326] not-italic">à chaque bouchée.</em>
            </h2>
          </div>
          <p className="text-[#6B5F52] text-sm max-w-xs leading-relaxed hidden lg:block">
            Chez Cinco Pizza, chaque détail compte pour vous offrir une
            expérience authentique et savoureuse.
          </p>
        </div>

        {/* Cards grid */}
        <div className="bv-grid grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {values.map((v) => (
            <div
              key={v.number}
              className="bv-card group relative bg-[#F9F5EF] rounded-xl sm:rounded-2xl overflow-hidden
                card-shadow border border-[#EDE3D3] hover:border-transparent
                transition-all duration-300 flex flex-col"
            >
              {/* Top accent bar */}
              <div className={`h-[4px] w-full ${v.topBar} shrink-0`} />

              <div className="p-4 sm:p-6 lg:p-7 flex flex-col flex-1">

                {/* Large ghost number */}
                <span
                  className="font-display leading-none select-none mb-3 sm:mb-4 block
                    text-[3rem] sm:text-[4rem] lg:text-[5rem] transition-colors duration-300"
                  style={{ color: v.accentColor, opacity: 0.12 }}
                >
                  {v.number}
                </span>

                {/* Title */}
                <h3
                  className="font-display text-sm sm:text-base lg:text-[1.1rem] text-[#24221F] leading-snug mb-2 sm:mb-3
                    group-hover:text-[#C92326] transition-colors duration-300"
                >
                  {v.title}
                </h3>

                {/* Divider */}
                <div
                  className="w-7 h-[2px] rounded-full mb-3 sm:mb-4 shrink-0 transition-all duration-300 group-hover:w-10"
                  style={{ background: v.accentColor }}
                />

                {/* Body */}
                <p className="text-[#6B5F52] text-[0.7rem] sm:text-[0.8rem] leading-relaxed">
                  {v.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
