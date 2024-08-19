"use client";

// 🧱 Components
import DownloadButton from "./DownloadButton";
import { RiChatFollowUpFill } from "react-icons/ri";

// 🗿 Models
import { Customer } from "@dashboard/libs/stripe";

const BottomBar = ({
  subscribers,
  date,
}: {
  subscribers: Customer[];
  date: { from: Date; to: Date };
}) => {
  return (
    <div className='flex items-center justify-between self-stretch'>
      <div className='flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-white shadow-lg'>
        <RiChatFollowUpFill />
        <p>{subscribers.length} nouveaux abonnés sur la période</p>
      </div>
      <DownloadButton subscribers={subscribers} date={date} />
    </div>
  );
};

export default BottomBar;
