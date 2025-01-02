import Sidenav from "./Sidenav";
import { auth } from "@dashboard/auth";

async function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // const isSignedIn = !!(await auth())?.user;
  // console.log("isSignedIn", isSignedIn);
  return (
    <>
      <Sidenav />
      <div className="flex h-full grow flex-col items-center gap-3 overflow-auto p-8">
        {children}
      </div>
    </>
  );
}

export default DashboardLayout;
