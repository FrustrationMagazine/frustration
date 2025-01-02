"use client";

// 🧪 Libraries
import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/ui";

// 🖼️ Icons
import { FaCreditCard } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { FaYoutube } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";

// ℹ️ Font../../fonts
import { poppins } from "../../fonts";

// 🧱 Components
import { Separator } from "@/ui/components/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/components/alert-dialog";
import { Button } from "@/ui/components/button";

type Link = {
  label: string;
  icon: ReactNode;
  href: string;
  key: string;
};

const LINKS: Link[] = [
  {
    label: "Revenus",
    icon: <FaCreditCard />,
    href: "/dashboard/income",
    key: "income",
  },
  {
    label: "Abonnés",
    icon: <IoIosPeople size={18} />,
    href: "/dashboard/customers",
    key: "customers",
  },
  {
    label: "Vidéos à la une",
    icon: <FaYoutube />,
    href: "/dashboard/videos",
    key: "videos",
  },
  {
    label: "Mises à jour",
    icon: <MdUpdate />,
    href: "/dashboard/update",
    key: "update",
  },
];

const SignOut = ({ action }: { action: () => void }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2">
          <RiLogoutBoxLine />
          <span>Se déconnecter</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Voulez-vous vraiment vous déconnecter ?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <form action={action}>
            <AlertDialogAction asChild>
              <Button type="submit">Se déconnecter</Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

/*********************************/
/*           🚀 UI               */
/*********************************/

const Sidenav = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const goToSignOut = () => router.push("/auth/signout");

  return (
    <aside className="flex w-60 flex-col items-center justify-between bg-black pb-4">
      <ul className="w-full space-y-2 px-3 text-frustration-yellow">
        {LINKS.map(({ label, icon, href, key }) => {
          return (
            <React.Fragment key={key}>
              <li>
                <Link
                  href={href}
                  className={cn(
                    `flex items-center gap-4 px-5 py-2 text-lg ${poppins.className} whitespace-nowrap rounded-md transition duration-500`,
                    href === currentPath && "bg-frustration-yellow-hover",
                  )}
                >
                  {icon} {label}
                </Link>
              </li>
              <Separator className="bg-frustration-yellow-hover" />
            </React.Fragment>
          );
        })}
      </ul>
      <SignOut action={goToSignOut} />
    </aside>
  );
};

export default Sidenav;
