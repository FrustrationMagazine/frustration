"use client";

// 🧱 Components
import { Button } from "@/ui/components/button";
import { IoIosDownload } from "react-icons/io";

// 🔧 Libs
import { createCSVinURL, downloadFileFromUrl } from "@/utils/files";
import { explicitDate } from "@/utils/dates";

// 🗿 Models
import { Customer } from "@/data-access/stripe";

export interface FileHeader {
  name: string;
  key: string;
  display: boolean;
}

export const FILE_HEADERS: FileHeader[] = [
  {
    name: "Id",
    key: "id",
    display: false,
  },
  {
    name: "Crée",
    key: "created",
    display: true,
  },
  {
    name: "Nom",
    key: "name",
    display: true,
  },
  {
    name: "Email",
    key: "email",
    display: true,
  },
  {
    name: "Montant",
    key: "amount",
    display: true,
  },
  {
    name: "Adresse",
    key: "adresse",
    display: true,
  },
  {
    name: "Code postal",
    key: "code_postal",
    display: true,
  },
  {
    name: "Ville",
    key: "ville",
    display: true,
  },
];

/* =============== */
/*       UI        */
/* =============== */

export default function ({
  customers,
  rangeDate,
}: {
  customers: Customer[];
  rangeDate: {
    from: Date;
    to: Date;
  };
}) {
  const handleDownloadCustomersList = () => {
    const CSVinURL = createCSVinURL(
      FILE_HEADERS.map(({ name }) => name),
      customers.map(({ name, email, amount, adresse, code_postal, ville }) => ({
        name,
        email,
        amount,
        adresse,
        code_postal,
        ville,
      })),
    );

    let filename = `nouveaux_abonnes_du_${explicitDate(rangeDate.from)}_au_${explicitDate(rangeDate.to)}.csv`;
    filename = filename.toLowerCase().replace(/\s/g, "_");
    downloadFileFromUrl(CSVinURL, filename);
  };

  return (
    <Button
      onClick={handleDownloadCustomersList}
      className='flex items-center gap-2 rounded-md'
      variant='inverted'
    >
      <IoIosDownload size={17} />
      <span> Télécharger </span>
    </Button>
  );
}
