import React from "react";
import Sidenav from "./Sidenav";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidenav />
      <div className='flex grow'>{children}</div>;
    </>
  );
}

export default DashboardLayout;
