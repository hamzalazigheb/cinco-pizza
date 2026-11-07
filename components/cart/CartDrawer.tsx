"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Plus, Minus, Trash2, ShoppingBag, CheckCircle2, Loader2,
  ArrowLeft, User, Phone, MapPin, Building2, MessageSquare, KeyRound,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

const sizeLabel = { senior: "Senior", mega: "Méga" };

type Step = "cart" | "form" | "success";

interface CustomerForm {
  name:    string;
  phone:   string;
  address: string;
  floor:   string;
  note:    string;
}

function InputField({
  icon: Icon, label, value, onChange, type = "text", required = false, placeholder, as,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  as?: "textarea";
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 font-ui text-[0.7rem] font-600
        text-[#6B5F52] uppercase tracking-wide">
        <Icon className="h-3 w-3" />
        {label}
        {required && <span className="text-[#C92326]">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-white border border-[#E2D5C3] rounded-xl px-3.5 py-2.5
            font-ui text-[0.82rem] text-[#24221F] placeholder:text-[#C9B9A8]
            focus:outline-none focus:border-[#C92326] focus:ring-1 focus:ring-[#C92326]/20
            resize-none transition"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-white border border-[#E2D5C3] rounded-xl px-3.5 py-2.5
            font-ui text-[0.82rem] text-[#24221F] placeholder:text-[#C9B9A8]
            focus:outline-none focus:border-[#C92326] focus:ring-1 focus:ring-[#C92326]/20
            transition"
        />
      )}
    </div>
  );
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, clearCart, total, count } =
    useCartStore();

  const [step,       setStep]       = useState<Step>("cart");
  const [customer,   setCustomer]   = useState<CustomerForm>({
    name: "", phone: "", address: "", floor: "", note: "",
  });
  const [ordering,   setOrdering]   = useState(false);
  const [orderId,    setOrderId]    = useState<string | null>(null);
  const [delivCode,  setDelivCode]  = useState<string | null>(null);
  const [orderError, setOrderError] = useState("");

  const DELIVERY_FEE = 5;

  const itemCount = count();
  const cartTotal = total();
  const orderTotal = cartTotal + DELIVERY_FEE;

  function setField(key: keyof CustomerForm) {
    return (v: string) => setCustomer((prev) => ({ ...prev, [key]: v }));
  }

  const formValid =
    customer.name.trim() !== "" &&
    customer.phone.trim() !== "" &&
    customer.address.trim() !== "";

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid) return;
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
          total: orderTotal,
          customer: {
            name:    customer.name.trim(),
            phone:   customer.phone.trim(),
            address: customer.address.trim(),
            floor:   customer.floor.trim() || undefined,
            note:    customer.note.trim()  || undefined,
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderId(data.orderId);
        setDelivCode(data.deliveryCode);
        setStep("success");
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
    setDelivCode(null);
    setOrderError("");
    setStep("cart");
    setCustomer({ name: "", phone: "", address: "", floor: "", note: "" });
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
                {step === "form" && (
                  <button
                    onClick={() => setStep("cart")}
                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center
                      text-[#24221F] hover:bg-[#EDE3D3] transition cursor-pointer shadow-sm mr-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                )}
                <ShoppingBag className="h-5 w-5 text-[#C92326]" />
                <h2 className="font-display text-xl text-[#24221F]">
                  {step === "cart"    && "Mon panier"}
                  {step === "form"    && "Vos infos"}
                  {step === "success" && "Commande envoyée !"}
                </h2>
                {step === "cart" && itemCount > 0 && (
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

            {/* ── Step indicator ── */}
            {step !== "success" && (
              <div className="flex items-center gap-2 px-6 pt-3 pb-1 shrink-0">
                {(["cart", "form"] as const).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center
                      font-ui text-[0.6rem] font-700 transition-colors
                      ${step === s
                        ? "bg-[#C92326] text-white"
                        : step === "form" && s === "cart"
                          ? "bg-[#526344] text-white"
                          : "bg-[#EDE3D3] text-[#8C7B6A]"
                      }`}>
                      {step === "form" && s === "cart" ? "✓" : i + 1}
                    </div>
                    <span className={`font-ui text-[0.65rem] ${step === s ? "text-[#24221F] font-600" : "text-[#8C7B6A]"}`}>
                      {s === "cart" ? "Panier" : "Infos de livraison"}
                    </span>
                    {i === 0 && <div className="w-6 h-px bg-[#E2D5C3]" />}
                  </div>
                ))}
              </div>
            )}

            {/* ════════════════════════════════════════
                STEP 1 — CART
            ════════════════════════════════════════ */}
            <AnimatePresence mode="wait">
              {step === "cart" && (
                <motion.div
                  key="step-cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {/* Items */}
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
                        <button onClick={closeCart} className="btn-primary text-sm px-6 py-2.5">
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
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
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
                                  <span className={`inline-block font-ui text-[0.62rem] font-600
                                    uppercase tracking-wide px-2 py-0.5 rounded-full mt-1
                                    ${item.size === "senior"
                                      ? "bg-[#FEF0F0] text-[#C92326]"
                                      : "bg-[#FBF5E8] text-[#8A6420]"
                                    }`}>
                                    {sizeLabel[item.size]}
                                  </span>
                                  <p className="font-ui text-[0.65rem] text-[#8C7B6A] mt-1.5 leading-relaxed line-clamp-2">
                                    {item.ingredients.join(", ")}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0E8DC]">
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

                  {/* Footer */}
                  {items.length > 0 && (
                    <div className="shrink-0 px-4 sm:px-5 py-4 sm:py-5 border-t border-[#E2D5C3] bg-[#F5EBDD] space-y-3">
                      <div className="bg-white rounded-xl px-4 py-3 space-y-2">
                        <div className="flex justify-between font-ui text-xs text-[#8C7B6A]">
                          <span>{itemCount} article{itemCount > 1 ? "s" : ""}</span>
                          <span>{cartTotal.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between font-ui text-xs text-[#8C7B6A]">
                          <span>Livraison</span>
                          <span className="text-[#C92326] font-600">+{DELIVERY_FEE.toFixed(2)} €</span>
                        </div>
                        <div className="border-t border-[#F0E8DC] pt-2 flex justify-between">
                          <span className="font-ui font-700 text-[#24221F] text-sm">Total</span>
                          <span className="font-display text-xl text-[#C92326]">
                            {orderTotal.toFixed(2)} €
                          </span>
                        </div>
                      </div>
                      <p className="font-ui text-[0.62rem] text-[#8C7B6A] text-center">
                        💳 Paiement par <strong>carte bancaire ou espèces</strong> à la livraison
                      </p>
                      <button
                        onClick={() => setStep("form")}
                        className="btn-primary w-full justify-center gap-2.5 text-sm py-3.5 cursor-pointer"
                      >
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                        Continuer — Infos de livraison
                      </button>
                      <button
                        onClick={clearCart}
                        className="w-full font-ui text-[0.7rem] text-[#8C7B6A]
                          hover:text-[#C92326] transition cursor-pointer py-1"
                      >
                        Vider le panier
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ════════════════════════════════════════
                  STEP 2 — CUSTOMER FORM
              ════════════════════════════════════════ */}
              {step === "form" && (
                <motion.form
                  key="step-form"
                  onSubmit={handleOrder}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.18 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                    <p className="font-ui text-[0.72rem] text-[#8C7B6A]">
                      Renseignez vos informations pour la livraison. Les champs marqués{" "}
                      <span className="text-[#C92326]">*</span> sont obligatoires.
                    </p>

                    <InputField
                      icon={User}
                      label="Prénom & Nom"
                      value={customer.name}
                      onChange={setField("name")}
                      placeholder="ex : Hamza Benali"
                      required
                    />
                    <InputField
                      icon={Phone}
                      label="Téléphone"
                      value={customer.phone}
                      onChange={setField("phone")}
                      type="tel"
                      placeholder="ex : 06 12 34 56 78"
                      required
                    />
                    <InputField
                      icon={MapPin}
                      label="Adresse complète"
                      value={customer.address}
                      onChange={setField("address")}
                      placeholder="ex : 12 rue de la Paix, Alger"
                      required
                    />
                    <InputField
                      icon={Building2}
                      label="Étage / Appartement"
                      value={customer.floor}
                      onChange={setField("floor")}
                      placeholder="ex : 3ème étage, Appt 7 (optionnel)"
                    />
                    <InputField
                      icon={MessageSquare}
                      label="Note pour le livreur"
                      value={customer.note}
                      onChange={setField("note")}
                      placeholder="ex : Sonner 2 fois, code portail 1234… (optionnel)"
                      as="textarea"
                    />
                  </div>

                  {/* Footer */}
                  <div className="shrink-0 px-4 sm:px-5 py-4 border-t border-[#E2D5C3] bg-[#F5EBDD] space-y-3">
                    {/* Order summary mini */}
                    <div className="bg-white rounded-xl px-4 py-2.5 flex items-center justify-between">
                      <span className="font-ui text-xs text-[#8C7B6A]">
                        {itemCount} art. + livraison {DELIVERY_FEE.toFixed(2)} €
                      </span>
                      <span className="font-display text-lg text-[#C92326]">
                        {orderTotal.toFixed(2)} €
                      </span>
                    </div>

                    {orderError && (
                      <p className="font-ui text-[0.72rem] text-[#C92326] text-center
                        bg-[#C92326]/8 rounded-lg py-2 px-3">
                        {orderError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={ordering || !formValid}
                      className="btn-primary w-full justify-center gap-2.5 text-sm py-3.5
                        disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {ordering ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…</>
                      ) : (
                        <><ShoppingBag className="h-4 w-4" /> Confirmer la commande</>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* ════════════════════════════════════════
                  STEP 3 — SUCCESS + DELIVERY CODE
              ════════════════════════════════════════ */}
              {step === "success" && (
                <motion.div
                  key="step-success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-6 text-center"
                >
                  {/* Success icon */}
                  <div className="w-16 h-16 rounded-full bg-[#526344]/15 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-[#526344]" />
                  </div>

                  {/* Message */}
                  <div>
                    <p className="font-display text-2xl text-[#24221F]">Commande envoyée !</p>
                    <p className="font-ui text-xs text-[#8C7B6A] mt-1.5">
                      Référence :{" "}
                      <strong className="text-[#C92326]">#{orderId}</strong>
                    </p>
                    <p className="font-ui text-xs text-[#8C7B6A] mt-1">
                      Nous préparons votre commande 🍕
                    </p>
                  </div>

                  {/* Delivery code */}
                  {delivCode && (
                    <div className="w-full bg-white border-2 border-[#C92326]/20 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <KeyRound className="h-4 w-4 text-[#C92326]" />
                        <p className="font-ui text-[0.72rem] font-700 text-[#C92326] uppercase tracking-wider">
                          Code de livraison
                        </p>
                      </div>
                      <p className="font-display text-5xl text-[#24221F] tracking-[0.25em]">
                        {delivCode}
                      </p>
                      <p className="font-ui text-[0.65rem] text-[#8C7B6A] leading-relaxed">
                        Communiquez ce code au livreur à la réception pour confirmer
                        la livraison. Ne le partagez pas avant l&apos;arrivée.
                      </p>
                    </div>
                  )}

                  <button onClick={handleClose} className="btn-primary px-8 py-2.5 text-sm">
                    Fermer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
