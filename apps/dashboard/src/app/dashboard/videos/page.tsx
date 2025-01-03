// 🔩 Base
import React from "react";

// 🧱 Components
import VideosCard from "./components/VideosCard";
import RedeployButton from "./components/RedeployButton";

// 🗿 Models
import { CardsDescription } from "./_models";

const VideosTab = () => (
  <>
    <div className="grid w-full grow grid-cols-3 gap-x-4 overflow-auto">
      {CardsDescription.map(({ key, ...props }) => (
        <VideosCard key={key} {...props} />
      ))}
    </div>
    <RedeployButton />
  </>
);

export default VideosTab;
