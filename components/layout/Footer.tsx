"use client";

import Image from "next/image";
import { Phone, MapPin, Clock } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const navLinks = [
  { href: "#menu",           label: "Notre Menu" },
  { href: "#offres",         label: "Nos Offres" },
  { href: "#notre-histoire", label: "Notre Histoire" },
  { href: "#contact",        label: "Contact" },
];

const hours = [
  { day: "Lun – Ven", time: "11h30 – 14h30 / 18h00 – 22h30" },
  { day: "Samedi",    time: "11h30 – 23h00" },
  { day: "Dimanche",  time: "12h00 – 22h00" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#24221F] text-[#F5EBDD]">
      {/* Top red accent line */}
      <div className="h-[3px] bg-gradient-to-r from-[#C92326] via-[#D9A441] to-[#526344]" />

      <div className="max-w-screen-xl mx-auto px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 mb-10 sm:mb-12">

          {/* Brand */}
          <div>
            <Image
              src="/images/logo.png"
              alt="Cinco Pizza"
              width={40}
              height={40}
              className="object-contain mb-3 brightness-[1.1] sm:w-[52px] sm:h-[52px]"
            />
            <p className="text-[#F5EBDD]/45 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 font-sans hidden sm:block">
              Une passion, une pizza. Pâte maison, ingrédients frais, préparation généreuse.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: InstagramIcon, href: "#", label: "Instagram" },
                { Icon: FacebookIcon,  href: "#", label: "Facebook" },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center
                    text-[#F5EBDD]/40 hover:text-[#C92326] hover:border-[#C92326]/40 transition-colors cursor-pointer">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-ui text-[0.65rem] uppercase tracking-[0.25em] text-[#D9A441] mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href}
                    className="font-ui text-[0.72rem] sm:text-[0.8rem] text-[#F5EBDD]/50
                      hover:text-[#F5EBDD] transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px bg-[#C92326] transition-all duration-200" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-ui text-[0.65rem] uppercase tracking-[0.25em] text-[#D9A441] mb-5">
              Horaires
            </h4>
            <ul className="space-y-3">
              {hours.map((h) => (
                <li key={h.day} className="flex items-start gap-2.5">
                  <Clock className="h-3.5 w-3.5 text-[#C92326] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-ui text-[0.72rem] text-[#F5EBDD]/40 uppercase tracking-wide">{h.day}</div>
                    <div className="font-ui text-[0.72rem] text-[#F5EBDD]/70 mt-0.5">{h.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — full width on mobile so CTA isn't squished */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-ui text-[0.65rem] uppercase tracking-[0.25em] text-[#D9A441] mb-5">
              Contact
            </h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2.5">
                <Phone className="h-3.5 w-3.5 text-[#C92326] mt-0.5 shrink-0" />
                <a href="tel:+33000000000"
                  className="font-ui text-[0.8rem] text-[#F5EBDD]/70 hover:text-[#F5EBDD] transition-colors">
                  06 00 00 00 00
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-[#C92326] mt-0.5 shrink-0" />
                <span className="font-ui text-[0.78rem] text-[#F5EBDD]/50 leading-relaxed">
                  123 Rue de la Pizza<br />75000 Paris, France
                </span>
              </li>
            </ul>
            <a href="tel:+33000000000" className="btn-primary w-full justify-center text-[0.72rem] py-3">
              <Phone className="h-3.5 w-3.5" />
              Commander par téléphone
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-ui text-[0.7rem] text-[#F5EBDD]/25">
            © 2026 Cinco Pizza. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="gold-dot" />
            <span className="font-ui text-[0.7rem] text-[#F5EBDD]/25 tracking-wider uppercase">
              Pizza · Paninis · Salades
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
