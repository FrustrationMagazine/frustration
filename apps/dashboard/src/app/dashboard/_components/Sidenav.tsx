"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { FaCreditCard } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { poppins } from "../../../utils/fonts";
import SignOut from "./SignOut";
import { Separator } from "@/ui/components/separator";
import { usePathname } from "next/navigation";
import { cn } from "@/ui/lib/utils";

type SidenavElement = {
  label: string;
  icon: ReactNode;
  href: string;
  key: string;
};

const SIDENAV_ELEMENTS: SidenavElement[] = [
  {
    label: "Revenus",
    icon: <FaCreditCard />,
    href: "/dashboard/income",
    key: "income",
  },
  {
    label: "Mises à jour",
    icon: <MdUpdate />,
    href: "/dashboard/update",
    key: "update",
  },
];

/*********************************/
/*           EXPORT              */
/*********************************/
const Sidenav = () => {
  const currentPath = usePathname();

  const Menus = (
    <ul className='w-full space-y-2 px-3 text-frustration-yellow'>
      {SIDENAV_ELEMENTS.map(({ label, icon, href, key }) => {
        return (
          <React.Fragment key={key}>
            <li>
              <Link
                href={href}
                className={cn(
                  `flex items-center gap-4 px-5 py-2 text-lg ${poppins.className} rounded-md transition duration-500`,
                  href === currentPath && "bg-frustration-yellow-hover",
                )}
              >
                {icon} {label}
              </Link>
            </li>
            <Separator className='bg-frustration-yellow-hover' />
          </React.Fragment>
        );
      })}
    </ul>
  );

  return (
    <aside className='flex w-60 flex-col items-center justify-between bg-black pb-4'>
      {Menus}
      <SignOut />
    </aside>
  );
};

export default Sidenav;
