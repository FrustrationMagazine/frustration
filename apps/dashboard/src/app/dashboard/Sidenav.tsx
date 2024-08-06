"use client";

// 🧪 Libraries
import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/ui/lib/utils";

// 🖼️ Icons
import { FaCreditCard } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";

// ℹ️ Font
import { poppins } from "@dashboard/fonts";

// 💥 Actions
import SignOut from "./SignOut";

// 🧱 Components
import { Separator } from "@/ui/components/separator";

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
    label: "Abonnés",
    icon: <IoIosPeople size={18} />,
    href: "/dashboard/subscribers",
    key: "subscribers",
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

  return (
    <aside className='flex w-60 flex-col items-center justify-between bg-black pb-4'>
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
      <SignOut />
    </aside>
  );
};

export default Sidenav;
