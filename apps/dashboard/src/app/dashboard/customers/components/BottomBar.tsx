"use client";

// 🧱 Components
import DownloadButton from "./DownloadButton";
import { RiChatFollowUpFill } from "react-icons/ri";

// 🗿 Models
import { Customer } from "@dashboard/libs/stripe";

const BottomBar = ({
  customers,
  rangeDate,
}: {
  customers: Customer[];
  rangeDate: { from: Date; to: Date };
}) => {
  return (
    <div className='flex items-center justify-between self-stretch'>
      <div className='flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-white shadow-lg'>
        <RiChatFollowUpFill />
        <p>{customers.length} nouveaux abonnés sur la période</p>
      </div>
      <DownloadButton customers={customers} rangeDate={rangeDate} />
    </div>
  );
};

export default BottomBar;
