// 🔩 Base
import React from "react";

// 🧱 Components
import LastUpdate from "./components/LastUpdate";
import FormUpdate from "./components/FormUpdate";

// 🐝 Fetch
import { fetchLastUpdate } from "@/data-access/stripe";

// 🧰 Server action configuration
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export default async function () {
  const lastUpdateInUTC = await fetchLastUpdate();

  const whiteBox =
    "flex m-auto h-[270px] min-w-[500px] flex-col items-center justify-center gap-5 rounded-md bg-white px-12 py-6 shadow-md";

  return (
    <div className={whiteBox}>
      <LastUpdate lastUpdateInUTC={lastUpdateInUTC} />
      <FormUpdate />
    </div>
  );
}
