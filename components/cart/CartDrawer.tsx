"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, CheckCircle2, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const sizeLabel = { senior: "Senior", mega: "Méga" };

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, clearCart, total, count } =
    useCartStore();

  const [ordering,  setOrdering]  = useState(false);
  const [orderId,   setOrderId]   = useState<string | null>(null);
  const [orderError,setOrderError]= useState("");

  const itemCount = count();
  const cartTotal = total();

  async function handleOrder() {
    setOrdering(true);
    setOrderError("");
    try {
      const res = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            name:        i.name,
            size:        i.size,
            quantity:    i.quantity,
            price:       i.price,
            ingredients: i.ingredients,
            image:       i.image,
          })),
          total: cartTotal,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderId(data.orderId);
        clearCart();
      } else {
        setOrderError(data.error || "Erreur lors de la commande");
      }
    } catch {
      setOrderError("Erreur réseau. Réessayez.");
    } finally {
      setOrdering(false);
    }
  }

  function handleClose() {
    setOrderId(null);
    setOrderError("");
    closeCart();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[#24221F]/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="fixed right-0 top-0 bottom-0 z-[80] w-full max-w-[420px]
              bg-[#F5EBDD] shadow-2xl flex flex-col
              pb-[env(safe-area-inset-bottom)]"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2D5C3] shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-[#C92326]" />
                <h2 className="font-display text-xl text-[#24221F]">
                  Mon panier
                </h2>
                {itemCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#C92326] text-white
                    font-ui text-[0.62rem] font-700 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center
                  text-[#24221F] hover:bg-[#EDE3D3] transition cursor-pointer shadow-sm"
                >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Items ── */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 py-20">
                  <div className="w-20 h-20 rounded-full bg-[#EDE3D3] flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-[#8C7B6A]" />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-lg text-[#24221F]">Votre panier est vide</p>
                    <p className="font-ui text-sm text-[#8C7B6A] mt-1">
                      Ajoutez des pizzas depuis la carte
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="btn-primary text-sm px-6 py-2.5"
                  >
                    Voir la carte
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.cartId}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.22 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-[#EDE3D3]"
                      >
                        <div className="flex gap-3">
                          {/* Thumbnail */}
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-display text-[0.95rem] text-[#24221F] leading-tight">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => removeItem(item.cartId)}
                                className="shrink-0 text-[#C92326]/40 hover:text-[#C92326]
                                  transition cursor-pointer mt-0.5"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Size badge */}
                            <span className={`inline-block font-ui text-[0.62rem] font-600
                              uppercase tracking-wide px-2 py-0.5 rounded-full mt-1
                              ${item.size === "senior"
                                ? "bg-[#FEF0F0] text-[#C92326]"
                                : "bg-[#FBF5E8] text-[#8A6420]"
                              }`}>
                              {sizeLabel[item.size]}
                            </span>

                            {/* Ingredients */}
                            <p className="font-ui text-[0.65rem] text-[#8C7B6A] mt-1.5 leading-relaxed line-clamp-2">
                              {item.ingredients.join(", ")}
                            </p>
                          </div>
                        </div>

                        {/* Qty + price row */}
                        <div className="flex items-center justify-between mt-3 pt-3
                          border-t border-[#F0E8DC]">
                          <div className="flex items-center gap-2 bg-[#F9F5EF] rounded-full px-2.5 py-1.5">
                            <button
                              onClick={() => updateQty(item.cartId, -1)}
                              className="w-5 h-5 rounded-full bg-white flex items-center justify-center
                                text-[#24221F] shadow-sm hover:bg-[#EDE3D3] transition cursor-pointer"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="font-ui font-700 text-xs text-[#24221F] w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.cartId, 1)}
                              className="w-5 h-5 rounded-full bg-[#C92326] flex items-center justify-center
                                text-white shadow-sm hover:bg-[#A91D20] transition cursor-pointer"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                          <span className="font-display text-lg text-[#24221F]">
                            {(item.price * item.quantity).toFixed(2)} €
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ── Footer: success state ── */}
            {orderId && (
              <div className="shrink-0 px-4 sm:px-5 py-8 border-t border-[#E2D5C3]
                bg-[#F5EBDD] flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-[#526344]/15 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-[#526344]" />
                </div>
                <div>
                  <p className="font-display text-xl text-[#24221F]">Commande envoyée !</p>
                  <p className="font-ui text-xs text-[#8C7B6A] mt-1">
                    Référence : <strong className="text-[#C92326]">#{orderId}</strong>
                  </p>
                  <p className="font-ui text-xs text-[#8C7B6A] mt-2">
                    Nous préparons votre commande 🍕
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="btn-primary px-6 py-2.5 text-sm"
                >
                  Fermer
                </button>
              </div>
            )}

            {/* ── Footer: total + CTA ── */}
            {!orderId && items.length > 0 && (
              <div className="shrink-0 px-4 sm:px-5 py-4 sm:py-5 border-t border-[#E2D5C3] bg-[#F5EBDD] space-y-3">

                {/* Summary */}
                <div className="bg-white rounded-xl px-4 py-3 space-y-2">
                  <div className="flex justify-between font-ui text-xs text-[#8C7B6A]">
                    <span>{itemCount} article{itemCount > 1 ? "s" : ""}</span>
                    <span>{cartTotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-ui text-xs text-[#8C7B6A]">
                    <span>Livraison</span>
                    <span className="text-[#526344] font-600">Offerte*</span>
                  </div>
                  <div className="border-t border-[#F0E8DC] pt-2 flex justify-between">
                    <span className="font-ui font-700 text-[#24221F] text-sm">Total</span>
                    <span className="font-display text-xl text-[#C92326]">
                      {cartTotal.toFixed(2)} €
                    </span>
                  </div>
                </div>

                {/* Payment note */}
                <p className="font-ui text-[0.62rem] text-[#8C7B6A] text-center">
                  💵 Paiement en <strong>espèces uniquement</strong> à la livraison
                </p>

                {/* Error */}
                {orderError && (
                  <p className="font-ui text-[0.72rem] text-[#C92326] text-center
                    bg-[#C92326]/8 rounded-lg py-2 px-3">
                    {orderError}
                  </p>
                )}

                {/* Confirm order CTA */}
                <button
                  onClick={handleOrder}
                  disabled={ordering}
                  className="btn-primary w-full justify-center gap-2.5 text-sm py-3.5
                    disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {ordering ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours...</>
                  ) : (
                    <><ShoppingBag className="h-4 w-4" /> Confirmer la commande</>
                  )}
                </button>

                {/* Clear cart */}
                <button
                  onClick={clearCart}
                  className="w-full font-ui text-[0.7rem] text-[#8C7B6A]
                    hover:text-[#C92326] transition cursor-pointer py-1"
                >
                  Vider le panier
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
