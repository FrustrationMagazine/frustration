// 🔩 Base
import React from "react";

// 🧱 Components
import CardResources from "./components/CardResources";

// 🗿 Models
import { CardsDescription } from "./_models";

export default function () {
  return (
    <div className='grid w-full grow grid-cols-3 gap-x-4 overflow-auto'>
      {CardsDescription.map(({ key, ...props }) => (
        <CardResources key={key} {...props} />
      ))}
    </div>
  );
}
