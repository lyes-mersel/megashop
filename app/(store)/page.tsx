// Components
import HeroSec from "@/components/store/homepage/HeroSec";
import BrandsSec from "@/components/store/homepage/BrandsSec";
import ProductsSec from "@/components/store/homepage/ProductsSec";
import TestimonialsSec from "@/components/store/homepage/TestimonialsSec";

// Data
import { testimonialsData } from "@/lib/data";

export default function HomePage() {
  return (
    <main>
      <HeroSec />
      <BrandsSec />
      <ProductsSec />
      <TestimonialsSec data={testimonialsData} />
    </main>
  );
}
