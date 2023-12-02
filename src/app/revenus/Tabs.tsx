"use client";

import React from "react";
import Link from "next/link";
import { poppins } from "@frustration/utils/fonts";
import { usePathname } from "next/navigation";
import classNames from "classnames";
export const Tabs = () => {
  return (
    <nav>
      <ul className="flex justify-center">
        <TabLink href="revenus/total">Total</TabLink>
        <TabLink href="revenus/abonnements">Abonnements</TabLink>
        <TabLink href="revenus/dons">Dons</TabLink>
        <TabLink href="revenus/ventes">Vente</TabLink>
      </ul>
    </nav>
  );
};

const TabLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
  const currentUrl = usePathname();

  return (
    <li className="p-4">
      <Link
        href={href}
        className={classNames({
          "bg-black": href === currentUrl,
          "text-frustration-yellow": href === currentUrl,
          "text-black": href !== currentUrl,
          [`py-1 px-6 text-xl font-bold rounded-full  ${poppins.className} hover:bg-gray-900 hover:bg-opacity-10`]: true
        })}
      >
        {children}
      </Link>
    </li>
  );
};
