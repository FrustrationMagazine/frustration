// 🔑 Auth
import { signedIn } from "@dashboard/auth";
import { unauthorized } from "next/navigation";
import Sidenav from "./Sidenav";

interface Props {
  readonly children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
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
