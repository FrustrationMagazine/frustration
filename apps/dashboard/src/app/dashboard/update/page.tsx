// 🔩 Base
import React from "react";

// 🧱 Components
import LastUpdate from "./components/LastUpdate";
import FormUpdate from "./components/FormUpdate";

// 🎨 Styles
const whiteBox =
  "flex m-auto h-[270px] min-w-[500px] flex-col items-center justify-center gap-5 rounded-md bg-white px-12 py-6 shadow-md";

export default async function () {
  return (
    <div className={whiteBox}>
      <LastUpdate />
      <FormUpdate />
    </div>
  );
}
