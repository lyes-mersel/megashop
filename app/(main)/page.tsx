// Components
import HeroSec from "@/components/homepage/HeroSec";
import BrandsSec from "@/components/homepage/BrandsSec";
import ProductsSec from "@/components/homepage/ProductsSec";
import TestimonialsSec from "@/components/homepage/TestimonialsSec";

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
