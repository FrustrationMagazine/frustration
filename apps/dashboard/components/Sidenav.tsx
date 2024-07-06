import React, { ReactNode } from "react";
import Link from "next/link";
import { FaCreditCard } from "react-icons/fa";
import { poppins } from "@/fonts";
import SignOut from "./SignOut";

const SIDENAV_ELEMENTS = [
  {
    label: "Revenus",
    icon: <FaCreditCard />,
    href: "/revenus"
  }
];

const MenuDivider = <hr className="border-3 border-frustration-yellow-hover" />;

const Menu = ({ label, icon, href }: { label: string; icon: ReactNode; href: string }) => {
  return (
    <li key={label.toLowerCase()}>
      <Link
        href={href}
        className={`flex px-5 py-2 mb-2 items-center gap-4 text-lg ${poppins.className} hover:bg-frustration-yellow-hover transition duration-500 rounded-md`}
      >
        {icon} {label}
      </Link>
      {MenuDivider}
    </li>
  );
};

const Menus = <ul className="text-frustration-yellow px-3 w-full">{SIDENAV_ELEMENTS.map(Menu)}</ul>;

/*********************************/
/*           EXPORT              */
/*********************************/
const Sidenav = () => {
  return (
    <aside className="bg-black w-60 flex flex-col items-center justify-between pb-4">
      {Menus}
      <SignOut />
    </aside>
  );
};

export default Sidenav;
