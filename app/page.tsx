import Header    from "@/components/layout/Header";
import Footer    from "@/components/layout/Footer";
import Hero      from "@/components/sections/Hero";
import BrandValues from "@/components/sections/BrandValues";
import MenuPreview from "@/components/sections/MenuPreview";
import Offers    from "@/components/sections/Offers";
import About     from "@/components/sections/About";
import Delivery  from "@/components/sections/Delivery";
import CartButton from "@/components/cart/CartButton";
import CartDrawer from "@/components/cart/CartDrawer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BrandValues />
        <MenuPreview />
        <Offers />
        <About />
        <Delivery />
      </main>
      <Footer />

      {/* Cart — floating button + drawer */}
      <CartButton />
      <CartDrawer />
    </>
  );
}
