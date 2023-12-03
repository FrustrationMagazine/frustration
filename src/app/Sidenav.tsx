import React, { ReactNode } from "react";
import Link from "next/link";
import { FaCreditCard } from "react-icons/fa";
import { poppins } from "@frustration/utils/fonts";

export const Sidenav = () => {
  return (
    <aside className="bg-black w-60">
      <ul className="text-frustration-yellow px-3">
        <li>
          <LinkSidenav href="/revenus">
            <FaCreditCard />
            Revenus
          </LinkSidenav>
        </li>
      </ul>
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
