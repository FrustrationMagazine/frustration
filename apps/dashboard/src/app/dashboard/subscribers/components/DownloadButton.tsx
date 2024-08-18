"use client";

// 🧱 Components
import { Button } from "@/ui/components/button";
import { IoIosDownload } from "react-icons/io";

// 🔧 Libs
import { createCSVinURL, downloadFileFromUrl } from "../_utils";

// 🗿 Model
import { HEADERS } from "../_models";
import { Customer } from "@dashboard/libs/stripe";

export default function DownloadButton({ subscribers }: { subscribers: Customer[] }) {
  const handleDownloadSubscribersList = () => {
    const headersNames = HEADERS.map(({ name }) => name);
    const CSVinURL = createCSVinURL(
      headersNames,
      subscribers.map(({ name, email, amount, adresse, code_postal, ville }) => ({
        name,
        email,
        amount,
        adresse,
        code_postal,
        ville,
      })),
    );
    downloadFileFromUrl(CSVinURL, "nouveaux_abonnes.csv");
  };

  return (
    <Button
      onClick={handleDownloadSubscribersList}
      className='flex items-center gap-2 rounded-md'
      variant='inverted'
    >
      <IoIosDownload size={17} />
      <span> Télécharger </span>
    </Button>
  );
}
