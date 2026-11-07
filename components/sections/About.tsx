"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const stats = [
  { val: "39",   label: "pizzas artisanales", color: "text-[#C92326]" },
  { val: "100%", label: "fait maison",         color: "text-[#D9A441]" },
  { val: "5 €",  label: "livraison",            color: "text-[#C92326]" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".ab-tag, .ab-h2, .ab-divider, .ab-p", {
        opacity: 0, y: 22, duration: 0.55, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: ".ab-text", start: "top 85%", toggleActions: "play none none none" },
      });
      gsap.from(".ab-quote", {
        opacity: 0, x: 24, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: ".ab-quote", start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.from(".ab-stat", {
        opacity: 0, y: 24, duration: 0.5, stagger: 0.12, ease: "back.out(1.5)",
        scrollTrigger: { trigger: ".ab-stats", start: "top 88%", toggleActions: "play none none none" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="notre-histoire" ref={sectionRef} className="bg-[#F5EBDD] section-py overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-6 lg:px-10">

        {/* ── Top split: text left / pull-quote right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-20 mb-14 sm:mb-20">

          {/* Left — story */}
          <div className="ab-text max-w-2xl">
            <span className="ab-tag overline text-[#C92326] block mb-4">Notre histoire</span>

            <h2 className="ab-h2 font-display text-[clamp(2rem,5vw,3.5rem)] text-[#24221F]
              leading-[1.05] tracking-tight mb-6">
              Une pizzeria de quartier,{" "}
              <em className="text-[#C92326] not-italic">avec l'âme d'un artisan.</em>
            </h2>

            <div className="ab-divider w-14 h-[3px] bg-[#D9A441] rounded-full mb-7" />

            <p className="ab-p text-[#4A4037] text-[0.95rem] sm:text-[1rem] leading-relaxed mb-4 max-w-lg font-sans">
              Chez Cinco Pizza, tout commence par la pâte. Pétrie chaque matin,
              elle repose le temps qu'il faut pour révéler toute sa légèreté.
            </p>
            <p className="ab-p text-[#6B5F52] text-[0.88rem] sm:text-[0.95rem] leading-relaxed max-w-lg font-sans">
              Nos ingrédients sont choisis avec soin, nos garnitures sont généreuses,
              et notre engagement est simple&nbsp;: vous régaler à chaque commande.
            </p>
          </div>

          {/* Right — pull quote */}
          <div className="ab-quote hidden lg:flex flex-col justify-center min-w-[240px] max-w-[300px]">
            <div className="border-l-[3px] border-[#C92326] pl-7">
              <span className="font-display text-[4rem] text-[#C92326] leading-none block -mb-2">"</span>
              <p className="font-display text-[1.35rem] text-[#24221F] leading-snug italic mb-4">
                L'art de la pizza,<br />comme à Naples.
              </p>
              <span className="font-ui text-[0.65rem] text-[#8C7B6A] uppercase tracking-[0.2em]">
                — Cinco Pizza
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="ab-stats relative">
          {/* Horizontal rule */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#E2D5C3] -z-0" />

          <div className="relative z-10 grid grid-cols-3 gap-0">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`ab-stat flex flex-col items-center text-center px-4 py-6 sm:py-8 bg-[#F5EBDD]
                  ${i === 0 ? "border-r border-[#E2D5C3]" : ""}
                  ${i === 1 ? "border-r border-[#E2D5C3]" : ""}`}
              >
                <span className={`font-display text-[clamp(2.4rem,6vw,4rem)] leading-none mb-1 ${s.color}`}>
                  {s.val}
                </span>
                <span className="font-ui text-[0.62rem] sm:text-[0.7rem] text-[#8C7B6A] uppercase tracking-[0.18em]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom footnote ── */}
        <p className="mt-4 text-center font-ui text-[0.62rem] text-[#B0A090]">
          Frais de livraison : 5 € · Paiement par carte ou espèces · Ouvert 7j/7 11h–23h
        </p>

      </div>
    </section>
  );
}
