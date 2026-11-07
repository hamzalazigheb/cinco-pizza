"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Phone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const steps = [
  { n: "01", title: "Choisissez",   desc: "Parcourez nos 39 pizzas artisanales.", color: "text-[#C92326]" },
  { n: "02", title: "Commandez",    desc: "En ligne ou par téléphone 7j/7 de 11h à 23h.", color: "text-[#D9A441]" },
  { n: "03", title: "Payez",        desc: "Par carte bancaire ou espèces à la livraison.", color: "text-[#526344]" },
  { n: "04", title: "Régalez-vous", desc: "Pizza chaude livrée à domicile en ~30 min.", color: "text-[#24221F]" },
];

export default function Delivery() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".delivery-img", {
        opacity: 0, x: -24, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: ".delivery-img", start: "top 85%", toggleActions: "play none none none" },
      });
      gsap.from(".del-step", {
        opacity: 0, y: 18, duration: 0.45, stagger: 0.1, ease: "back.out(1.4)",
        scrollTrigger: { trigger: ".del-step", start: "top 85%", toggleActions: "play none none none" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="livraison" ref={sectionRef} className="bg-[#F5EBDD] section-py">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

          {/* Left — bag photo */}
          <div className="delivery-img relative rounded-2xl overflow-hidden aspect-[4/3]
            shadow-[0_16px_48px_rgba(36,34,31,0.1)]">
            <Image
              src="/images/delivery-bag.png"
              alt="Livraison Cinco Pizza"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#24221F]/20 to-transparent" />
            {/* ~30 min badge */}
            <div className="absolute bottom-6 right-6
              bg-[#D9A441] text-white rounded-2xl px-5 py-3.5
              shadow-[0_6px_20px_rgba(217,164,65,0.4)] text-center">
              <div className="font-display text-2xl leading-none">~30</div>
              <div className="font-ui text-[9px] uppercase tracking-widest opacity-80 mt-0.5">minutes</div>
            </div>
          </div>

          {/* Right */}
          <div>
            <span className="overline text-[#C92326] block mb-5">Comment commander</span>
            <h2 className="font-display text-[clamp(2rem,3.5vw,2.8rem)] text-[#24221F] mb-10">
              Simple, rapide,{" "}
              <em className="text-[#C92326] not-italic">délicieux.</em>
            </h2>

            <div className="space-y-6 mb-10">
              {steps.map((s) => (
                <div key={s.n} className="del-step flex items-start gap-5">
                  <span className={`font-display text-4xl shrink-0 leading-none opacity-25 ${s.color}`}>
                    {s.n}
                  </span>
                  <div className="pt-1">
                    <h4 className="font-ui font-700 text-[#24221F] text-sm mb-1">{s.title}</h4>
                    <p className="text-[#6B5F52] text-sm leading-relaxed font-sans">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E2D5C3] pt-8">
              <p className="font-ui text-[#8C7B6A] text-[0.6rem] uppercase tracking-widest mb-4">
                Passez votre commande
              </p>
              <a href="tel:+33164001010" className="btn-primary flex items-center gap-2 w-fit">
                <Phone className="h-4 w-4" />
                Appeler maintenant
              </a>
              <p className="mt-4 text-[#8C7B6A] text-xs font-ui">
                Frais de livraison : 5 € · Paiement par carte ou espèces · Ouvert 7j/7 11h–23h
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
