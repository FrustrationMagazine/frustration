import React, { ReactNode } from "react";
import Link from "next/link";
import { FaCreditCard } from "react-icons/fa";
import { poppins } from "@frustration/utils/fonts";
import { RiLogoutBoxLine } from "react-icons/ri";

export const Sidenav = async () => {
  return (
    <aside className="bg-black w-60 flex flex-col items-center justify-between pb-4">
      <ul className="text-frustration-yellow px-3 w-full">
        <li>
          <LinkSidenav href="/revenus">
            <FaCreditCard />
            Revenus
          </LinkSidenav>
        </li>
      </ul>
      <Link href="/api/auth/signout?callbackUrl/">
        <button
          type="button"
          className="text-black bg-frustration-yellow px-4 py-2 font-bold rounded-md flex items-center gap-2"
        >
          <RiLogoutBoxLine />
          <span>Se déconnecter</span>
        </button>
      </Link>
    </aside>
  );
};

const LinkSidenav = ({ children, href }: { children: ReactNode; href: string }) => {
  return (
    <>
      <Link
        href={href}
        className={`flex px-5 py-2 mb-2 items-center gap-4 text-lg ${poppins.className} hover:bg-frustration-yellow-hover transition duration-500 rounded-md`}
      >
        {children}
      </Link>
      <hr className="border-3 border-frustration-yellow-hover" />
    </>
  );
};
