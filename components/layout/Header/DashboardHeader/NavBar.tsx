import Link from "next/link";
import Image from "next/image";

// Components
import UserMenu from "@/components/layout/Header/DashboardHeader/UserMenu";
import NotificationBtn from "@/components/layout/Header/DashboardHeader/NotificationBtn";

const NavBar = () => {
  return (
    <nav className="md:px-10 lg:px-20 sticky top-0 bg-white z-20">
      <div className="flex relative max-w-frame mx-auto items-center justify-between py-2 px-4 xl:px-0">
        <div className="flex items-center">
          {/* Logo */}
          <h1 className="hidden">Mega Shop</h1>
          <Link href="/" className="mr-3 lg:mr-10">
            <Image
              priority
              src="/icons/logo.svg"
              height={80}
              width={140}
              alt="logo"
              className="h-[60px] md:h-[70px] lg:h-[80px]"
            />
          </Link>
        </div>

        <div className="flex gap-2">
          <NotificationBtn />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
