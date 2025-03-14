import Link from "next/link";
import Image from "next/image";

// Components
import UserMenu from "@/components/layout/Header/DashboardHeader/UserMenu";
import ResNavbar from "@/components/layout/Header/DashboardHeader/ResNavbar";
import NotificationBtn from "@/components/layout/Header/DashboardHeader/NotificationBtn";

// Utils & types
import { cn } from "@/lib/utils";
import { NavMenu } from "@/lib/types/navbar.types";

// Styles
import { integralCF } from "@/styles/fonts";

const data: NavMenu = [
  {
    id: 1,
    type: "MenuItem",
    label: "Boutique",
    url: "/shop",
    children: [],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "Marketplace",
    url: "/marketplace",
    children: [],
  },
];

const NavBar = () => {
  return (
    <nav className="md:px-10 lg:px-20 sticky top-0 bg-white z-20">
      <div className="flex relative max-w-frame mx-auto items-center justify-between py-4 md:py-5 px-4 xl:px-0">
        <div className="flex items-center">
          {/* Responsive NavBar in sm screens */}
          <div className="block md:hidden mr-4">
            <ResNavbar data={data} />
          </div>

          {/* Logo */}
          <Link
            href="/"
            className={cn([integralCF.className, "mr-3 lg:mr-10"])}
          >
            <Image
              priority
              src="/icons/logo.svg"
              height={100}
              width={100}
              alt="logo"
              className="max-w-[60px] max-h-[60px]"
            />
          </Link>
        </div>

        <div className="flex gap-1">
          <NotificationBtn />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
