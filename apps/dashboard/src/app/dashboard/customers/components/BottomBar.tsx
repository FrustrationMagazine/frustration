"use client";

// 🧱 Components
import DownloadButton from "./DownloadButton";

// 🖼️ Assets
import { FaPeopleGroup } from "react-icons/fa6";
import { RiChatFollowUpFill } from "react-icons/ri";

// 🗿 Models
import { Customer } from "@/data-access/stripe";

const BottomBar = ({
  customers,
  numberOfActiveCustomers,
  rangeDate,
}: {
  customers: Customer[];
  numberOfActiveCustomers: number;
  rangeDate: { from: Date; to: Date };
}) => {
  return (
    <div className="flex items-center gap-2 self-stretch">
      <div className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-white shadow-lg">
        <RiChatFollowUpFill />
        <p>{customers.length} nouveaux abonnés sur la période</p>
      </div>
      <div className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-zinc-900 shadow-lg">
        <FaPeopleGroup />
        <p>{numberOfActiveCustomers} abonnés actifs</p>
      </div>
      <div className="ml-auto">
        <DownloadButton customers={customers} rangeDate={rangeDate} />
      </div>
    </div>
  );
};

export default BottomBar;
