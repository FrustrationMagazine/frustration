// 🔑 Auth
import { signedIn } from "@dashboard/auth";
import { unauthorized } from "next/navigation";
import Sidenav from "./Sidenav";

export default async function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const isSignedIn = await signedIn();
  if (!isSignedIn) unauthorized();

  return (
    <>
      <Sidenav />
      <div className="flex h-full grow flex-col items-center gap-3 overflow-auto p-8">
        {children}
      </div>
    </>
  );
}
