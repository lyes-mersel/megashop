import React from "react";
import Image from "next/image";
import Link from "next/link";

// Utils & Fonts
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";

// UI Components
import InputGroup from "@/components/ui/input-group";

// Components
import { Button } from "@/components/ui/button";
import CartBtn from "./CartBtn";
import UserMenu from "./UserMenu";

const NavBar = async () => {
  return (
    <nav className="flex max-w-frame mx-auto items-center justify-between py-2 px-4 xl:px-0">
      <div className="flex items-center">
        {/* Logo */}
        <Link href="/" className="mr-3 lg:mr-10 flex items-center gap-2">
          <Image
            priority
            src="/manifest/favicon.svg"
            height={65}
            width={65}
            alt="logo"
            className="h-[50px] md:h-[55px] w-auto"
          />
          <span className="hidden sm:block bg-black w-[5px] mt-2 h-[28px]"></span>
          <h1
            className={cn([integralCF.className, "hidden sm:block text-3xl"])}
          >
            MEGA SHOP
          </h1>
        </Link>
      </div>

      {/* Search Bar */}
      <InputGroup className="hidden md:flex max-w-[300px] lg:max-w-[500px] flex-1 mr-3 lg:mr-10 h-10 bg-[#F0F0F0]">
        <InputGroup.Text>
          <Image
            priority
            src="/icons/search.svg"
            height={20}
            width={20}
            alt="search"
            className="min-w-5 min-h-5"
          />
        </InputGroup.Text>
        <InputGroup.Input
          type="search"
          name="search"
          placeholder="Search for products..."
          className="bg-transparent placeholder:text-black/40"
        />
      </InputGroup>

      {/* User Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Search Btn in small screens */}
        <Link href="/search" className="block md:hidden">
          <Button variant="ghost" className="p-1 md:p-2">
            <Image
              priority
              src="/icons/search-black.svg"
              height={24}
              width={24}
              alt="search"
              className="max-w-[20px] max-h-[20px] md:max-w-[24px] md:max-h-[24px]"
            />
          </Button>
        </Link>

        <CartBtn />
        <UserMenu />
      </div>
    </nav>
  );
};

export default NavBar;
