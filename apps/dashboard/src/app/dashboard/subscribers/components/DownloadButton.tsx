"use client";

// 🧱 Components
import { Button } from "@/ui/components/button";
import { IoIosDownload } from "react-icons/io";

// 🔧 Libs
import { createCSVinURL, downloadFileFromUrl } from "../_utils";
import { explicitDate } from "@dashboard/utils/dates";

// 🗿 Model
import { HEADERS } from "../_models";
import { Customer } from "@dashboard/libs/stripe";

export default function DownloadButton({
  subscribers,
  date,
}: {
  subscribers: Customer[];
  date: {
    from: Date;
    to: Date;
  };
}) {
  console.log("date", date);
  console.log("from", date.from);
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

    let filename = `nouveaux_abonnes_du_${explicitDate(date.from)}_au_${explicitDate(date.to)}.csv`;
    filename = filename.toLowerCase().replace(/\s/g, "_");
    downloadFileFromUrl(CSVinURL, filename);
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
