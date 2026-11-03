"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartButton() {
  const { toggleCart, count } = useCartStore();
  const itemCount = count();

  // Defer badge rendering to the client to avoid SSR/client hydration mismatch
  // (cart state lives only in the browser).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const displayCount = mounted ? itemCount : 0;

  return (
    <motion.button
      onClick={toggleCart}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[60]
        w-14 h-14 rounded-full bg-[#C92326] text-white
        flex items-center justify-center
        shadow-[0_8px_32px_rgba(201,35,38,0.4)]
        hover:bg-[#A91D20] transition-colors cursor-pointer"
      aria-label="Ouvrir le panier"
    >
      <ShoppingBag className="h-5 w-5" />

      {/* Badge */}
      <AnimatePresence>
        {displayCount > 0 && (
          <motion.span
            key={displayCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
              bg-[#D9A441] text-white font-ui font-700 text-[0.6rem]
              flex items-center justify-center shadow-md"
          >
            {displayCount > 9 ? "9+" : displayCount}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
