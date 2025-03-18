import React from "react";
import { SocialNetworks } from "@/lib/types/footer.types";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import NewsLetterSection from "./NewsLetterSection";
import LayoutSpacing from "./LayoutSpacing";

const githubLinks: SocialNetworks[] = [
  {
    id: 1,
    name: "BRAHAMI Rayan",
    url: "https://github.com/BrahimiRayan",
    icon: <FaGithub />,
  },
  {
    id: 2,
    name: "MECHKOUR Billal",
    url: "https://github.com/Billalmechekour",
    icon: <FaGithub />,
  },
  {
    id: 3,
    name: "MERSEL Lyes",
    url: "https://github.com/lyes-mersel",
    icon: <FaGithub />,
  },
  {
    id: 4,
    name: "MESSAOUDENE Saïd",
    url: "https://github.com/Messaoudene-Said",
    icon: <FaGithub />,
  },
];

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
              />
            </Link>
            <p className="text-black/60 max-w-[430px] text-center md:text-start">
              Découvrez une collection unique de vêtements pour femmes et
              hommes, conçus pour s&apos;adapter à votre style et vous accompagner
              avec élégance au quotidien.
            </p>
          </div>

          <hr className="h-[1px] border-t-black/10 mb-6" />

          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-black/60 text-center sm:text-left mb-4 sm:mb-0">
              Mega Shop © 2025 – Projet académique réalisé par des étudiants en
              Master 1 Génie Logiciel de l&apos;Université de Béjaïa.
            </p>
            <div className="flex items-center">
              {githubLinks.map((link) => (
                <Link
                  key={link.id}
                  title={link.name}
                  href={link.url}
                  className="bg-white hover:bg-black hover:text-white transition-all w-7 h-7 rounded-full border border-black/20 flex items-center justify-center p-1.5 ml-2"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FaGithub size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <LayoutSpacing />
      </div>
    </footer>
  );
};

export default Footer;
