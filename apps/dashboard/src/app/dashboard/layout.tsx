import React from "react";
import Sidenav from "./Sidenav";

function DashboardLayout({ children }: { children: React.ReactNode }) {
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
