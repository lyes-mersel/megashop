import Link from "next/link";
import Image from "next/image";

// Components
import NewsLetterSection from "./NewsLetterSection";
import Attribution from "@/components/layout/store/Footer/Attribution";
import LayoutSpacing from "./LayoutSpacing";

const Footer = () => {
  return (
    <footer className="mt-10">
      <div className="relative">
        <div className="absolute bottom-0 w-full h-1/2 bg-[#F0F0F0]"></div>
        <div className="px-4">
          <NewsLetterSection />
        </div>
      </div>

      <div className="pt-8 md:pt-[50px] bg-[#F0F0F0] px-4 pb-4">
        <div className="max-w-frame mx-auto">
          <div className="text-center mb-8 flex flex-col md:flex-row gap-4 md:gap-24 lg:gap-44 justify-center items-center">
            <Link href="/">
              <Image
                priority
                src="/icons/logo.svg"
                height={100}
                width={175}
                alt="Mega Shop Logo"
                className="h-[100px] w-[175px]"
              />
            </Link>
            <p className="text-black/60 max-w-[430px] text-center md:text-start">
              Découvrez une collection unique de vêtements pour femmes et
              hommes, conçus pour s&apos;adapter à votre style et vous
              accompagner avec élégance au quotidien.
            </p>
          </div>
          <Attribution />
        </div>
        <LayoutSpacing />
      </div>
    </footer>
  );
};

export default Footer;
