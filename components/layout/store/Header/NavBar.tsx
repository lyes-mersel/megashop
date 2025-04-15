import React from "react";
import Image from "next/image";
import Link from "next/link";

// UI Components
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import InputGroup from "@/components/ui/input-group";

// Components
import { Button } from "@/components/ui/button";
import { MenuList } from "./MenuList";
import { MenuItem } from "./MenuItem";
import ResMainNavbar from "./ResNavbar";
import CartBtn from "./CartBtn";
import UserMenu from "./UserMenu";
import NotificationBtn from "@/components/layout/store/Header/NotificationBtn";

// Utils & Types
import getAuth from "@/lib/auth/getAuth";
import { NavMenu } from "@/lib/types/ui/navbar.types";

const data: NavMenu = [
  {
    id: 1,
    type: "MenuItem",
    label: "Boutique",
    url: "/catalog?type=boutique",
    children: [],
  },
  {
    id: 2,
    type: "MenuItem",
    label: "Marketplace",
    url: "/catalog?type=marketplace",
    children: [],
  },
];

const NavBar = async () => {
  const session = await getAuth();

  return (
    <nav className="flex relative max-w-frame mx-auto items-center justify-between py-2 px-4 xl:px-0">
      <div className="flex items-center">
        {/* Responsive NavBar in sm screens */}
        <div className="block md:hidden mr-4">
          <ResMainNavbar data={data} />
        </div>

        {/* Logo */}
        <h1 className="hidden">Mega Shop</h1>
        <Link href="/" className="mr-3 lg:mr-10">
          <Image
            priority
            src="/icons/logo.svg"
            height={80}
            width={140}
            alt="logo"
            className="h-[60px] md:h-[70px] lg:h-[80px] w-auto"
          />
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden md:flex mr-2 lg:mr-7">
          <NavigationMenuList>
            {data.map((item) => (
              <React.Fragment key={item.id}>
                {item.type === "MenuItem" && (
                  <MenuItem label={item.label} url={item.url} />
                )}
                {item.type === "MenuList" && (
                  <MenuList data={item.children} label={item.label} />
                )}
              </React.Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Search Bar */}
      <InputGroup className="hidden md:flex flex-1 bg-[#F0F0F0] mr-3 lg:mr-10 max-w-[600px]">
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
        {session && <NotificationBtn />}
        <UserMenu />
      </div>
    </nav>
  );
};

export default NavBar;
