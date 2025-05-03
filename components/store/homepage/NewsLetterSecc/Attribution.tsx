import Link from "next/link";
import { FaGithub } from "react-icons/fa";

// Types
import { SocialNetworks } from "@/lib/types/ui/footer.types";

const githubLinks: SocialNetworks[] = [
  {
    id: 1,
    name: "MERSEL Lyes",
    url: "https://github.com/lyes-mersel",
  },
  {
    id: 2,
    name: "BRAHAMI Rayan",
    url: "https://github.com/BrahimiRayan",
  },
  {
    id: 3,
    name: "MECHKOUR Billal",
    url: "https://github.com/Billalmechekour",
  },
  {
    id: 4,
    name: "MESSAOUDENE Saïd",
    url: "https://github.com/Messaoudene-Said",
  },
];

const Attribution = () => {
  return (
    <>
      <hr className="h-[1px] border-t-black/10 mb-3" />

      <div className="flex flex-col sm:flex-row justify-between items-center pb-3">
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
    </>
  );
};

export default Attribution;
