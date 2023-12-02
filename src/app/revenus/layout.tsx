import React from "react";
import { Tabs } from "./Tabs";
export default function RevenusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-5 w-full">
      <Tabs />
      {children}
    </div>
  );
}
