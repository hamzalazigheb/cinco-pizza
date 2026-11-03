"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pizzaRef   = useRef<HTMLDivElement>(null);
  const ring1Ref   = useRef<HTMLDivElement>(null);
  const ring2Ref   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".h-tag",     { opacity: 0, x: -16, duration: 0.5 }, 0.2)
        .from(".h-line1",   { opacity: 0, y: 60, duration: 0.75 }, 0.35)
        .from(".h-line2",   { opacity: 0, y: 60, duration: 0.75 }, 0.47)
        .from(".h-divider", { scaleX: 0, duration: 0.5, transformOrigin: "left" }, 0.62)
        .from(".h-sub",     { opacity: 0, y: 14, duration: 0.45 }, 0.72)
        .from(".h-ctas",    { opacity: 0, y: 12, duration: 0.4 }, 0.84)
        .from(".h-stat",    { opacity: 0, y: 12, duration: 0.35, stagger: 0.08 }, 0.95)
        .from(pizzaRef.current, { opacity: 0, scale: 0.88, duration: 1, ease: "power2.out" }, 0.1)
        .from(".h-badge",   { opacity: 0, scale: 0.75, duration: 0.4, stagger: 0.1 }, 0.9);

      /* ── Continuous rotations ── */
      if (pizzaRef.current) {
        gsap.to(pizzaRef.current, {
          rotation: 360, duration: 60, ease: "none", repeat: -1, transformOrigin: "50% 50%",
        });
      }
      if (ring1Ref.current) {
        gsap.to(ring1Ref.current, {
          rotation: -360, duration: 90, ease: "none", repeat: -1, transformOrigin: "50% 50%",
        });
      }
      if (ring2Ref.current) {
        gsap.to(ring2Ref.current, {
          rotation: 360, duration: 130, ease: "none", repeat: -1, transformOrigin: "50% 50%",
        });
      }

      /* ── Scroll parallax ── */
      gsap.to(".pizza-float", {
        yPercent: 6, ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top", end: "bottom top", scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef}
      className="relative bg-[#F5EBDD] overflow-hidden flex flex-col
        pt-[72px] sm:pt-[80px] lg:pt-[88px]"
    >

      {/* Decorative bg circle */}
      <div className="absolute right-0 top-0 w-[min(70vw,500px)] aspect-square rounded-full
        bg-[#EEE3CF] translate-x-1/3 -translate-y-1/4 pointer-events-none" />

      {/* Accent dots — desktop only */}
      <div className="absolute left-[6%] top-[22%] w-2.5 h-2.5 rounded-full bg-[#D9A441] hidden lg:block" />
      <div className="absolute left-[10%] top-[27%] w-1.5 h-1.5 rounded-full bg-[#526344] hidden lg:block" />

      {/* ── MAIN GRID (single responsive layout) ──
          mobile  : pizza on top (order-1), text below (order-2)
          desktop : text left  (order-1), pizza right (order-2) — lg:grid-cols-2
      */}
      <div className="relative z-10 flex-1
        grid grid-cols-1 lg:grid-cols-2
        max-w-screen-xl mx-auto w-full
        px-5 sm:px-6 lg:px-10
        items-center
        lg:min-h-[calc(100vh-88px)]">

        {/* ── PIZZA (order-1 → top on mobile, right on desktop) ── */}
        <div className="order-1 lg:order-2
          pizza-float flex items-center justify-center
          pt-8 pb-4 lg:py-0 will-change-transform">

          {/* wrapper: size adapts  */}
          <div className="relative" style={{ width: "clamp(220px, 60vw, 520px)", aspectRatio: "1" }}>

            {/* Ring 2 — outer gold (desktop prominent) */}
            <div ref={ring2Ref}
              className="absolute rounded-full will-change-transform pointer-events-none"
              style={{
                inset: "-22%",
                border: "1px dashed rgba(217,164,65,0.18)",
                borderRadius: "50%",
              }}
            />

            {/* Ring 1 — inner red dashes */}
            <div ref={ring1Ref}
              className="absolute rounded-full will-change-transform pointer-events-none"
              style={{
                inset: "-10%",
                border: "1.5px dashed rgba(201,35,38,0.22)",
                borderRadius: "50%",
              }}
            />

            {/* Pizza disc */}
            <div ref={pizzaRef}
              className="relative w-full h-full rounded-full overflow-hidden will-change-transform
                shadow-[0_20px_60px_rgba(36,34,31,0.15),0_4px_16px_rgba(201,35,38,0.1)]
                ring-4 ring-[#F5EBDD]"
            >
              <Image
                src="/images/pizza-hero.png"
                alt="Pizza Cinco"
                fill
                sizes="(max-width: 640px) 60vw, (max-width: 1024px) 50vw, 520px"
                className="object-cover"
                priority
                quality={90}
              />
            </div>

            {/* Badge: Maison */}
            <div className="h-badge absolute -bottom-2 sm:-bottom-3 -left-3 sm:-left-6 lg:-left-12
              bg-[#C92326] text-white rounded-xl sm:rounded-2xl
              px-3 py-2.5 sm:px-5 sm:py-3.5
              shadow-[0_8px_24px_rgba(201,35,38,0.3)] z-10">
              <div className="font-display text-lg sm:text-2xl leading-none">100%</div>
              <div className="font-ui text-[7px] sm:text-[9px] uppercase tracking-widest opacity-80 mt-0.5 sm:mt-1">
                Fait maison
              </div>
            </div>

            {/* Badge: Pizzas */}
            <div className="h-badge absolute -top-2 sm:-top-3 -right-2 sm:-right-4 lg:-right-10
              bg-[#24221F] text-white rounded-xl sm:rounded-2xl
              px-3 py-2 sm:px-4 sm:py-3
              shadow-[0_8px_24px_rgba(36,34,31,0.25)] z-10">
              <div className="font-display text-base sm:text-xl leading-none">39</div>
              <div className="font-ui text-[7px] sm:text-[9px] uppercase tracking-widest opacity-60 mt-0.5">
                Pizzas
              </div>
            </div>

            {/* Floating badge: Chef Artisan */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="h-badge hidden sm:block absolute bottom-10 -right-6 lg:-right-14
                bg-[#D9A441] text-white rounded-xl
                px-3 py-2.5 shadow-[0_6px_18px_rgba(217,164,65,0.35)] z-10"
            >
              <div className="font-ui text-[8px] uppercase tracking-widest opacity-90">Chef</div>
              <div className="font-display text-base leading-none mt-0.5">Artisan</div>
            </motion.div>

            {/* Floating badge: Frais du jour */}
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="h-badge hidden sm:block absolute top-8 -left-3 lg:-left-10
                bg-[#526344] text-white rounded-xl
                px-3 py-2.5 shadow-[0_6px_18px_rgba(82,99,68,0.3)] z-10"
            >
              <div className="font-ui text-[8px] uppercase tracking-widest opacity-90">Frais</div>
              <div className="font-display text-base leading-none mt-0.5">du jour</div>
            </motion.div>

          </div>
        </div>

        {/* ── TEXT (order-2 → below pizza on mobile, left on desktop) ── */}
        <div className="order-2 lg:order-1
          flex flex-col justify-center
          pb-10 lg:py-0 pr-0 lg:pr-10">

          <div className="h-tag flex items-center gap-2 mb-4 sm:mb-7">
            <span className="olive-tag text-[0.6rem]">Artisanal · Fait Maison</span>
            <span className="gold-dot" />
          </div>

          <div className="overflow-hidden mb-1">
            <h1 className="h-line1 font-display text-[clamp(2.4rem,8vw,6.5rem)]
              leading-[0.92] tracking-tight text-[#24221F]">
              Une Passion
            </h1>
          </div>
          <div className="overflow-hidden mb-4 sm:mb-5">
            <h1 className="h-line2 font-display italic text-[clamp(2.4rem,8vw,6.5rem)]
              leading-[0.92] tracking-tight text-[#C92326]">
              pour la Pizza.
            </h1>
          </div>

          <div className="h-divider w-12 h-[2.5px] bg-[#D9A441] mb-4 sm:mb-5 rounded-full" />

          <p className="h-sub text-[#6B5F52] text-sm sm:text-base leading-relaxed max-w-sm mb-6 sm:mb-7">
            Pâte pétrie à la main chaque jour, ingrédients frais soigneusement
            sélectionnés. Une vraie pizza comme à Naples.
          </p>

          <div className="h-ctas flex flex-wrap items-center gap-3 mb-7 sm:mb-8">
            <a href="#menu" className="btn-primary flex items-center gap-2 py-3 px-5">
              Voir la carte <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#notre-histoire" className="btn-outline py-3 px-5">
              Notre histoire
            </a>
          </div>

          <div className="flex items-stretch gap-0 divide-x divide-[#D9C4AA]">
            {[
              { val: "39",   sub: "Pizzas" },
              { val: "100%", sub: "Fait maison" },
              { val: "0 €",  sub: "Livraison*" },
            ].map((s) => (
              <div key={s.sub} className="h-stat px-4 first:pl-0 last:pr-0">
                <div className="font-display text-xl sm:text-2xl text-[#24221F] leading-none">{s.val}</div>
                <div className="font-ui text-[0.58rem] text-[#8C7B6A] uppercase tracking-widest mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
