"use client";
import React from "react";
import { getLastSubscribers } from "./_actions";

// 🧱 Components
import { DatePickerWithRange } from "@/ui/components/date-range-picker";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/table";
import SuperBallsLoader from "@dashboard/components/SuperBallsLoader/SuperBallsLoader";

import { RiChatFollowUpFill } from "react-icons/ri";
import { Button } from "@/ui/components/button";
import { IoIosDownload } from "react-icons/io";

export const maxDuration = 60;

const downloadCSV = (data: any, headers: any) => {
  const CSV_SEPARATOR = ";";
  const csvContent = [
    headers.join(CSV_SEPARATOR),
    ...data.map((row: any) => Object.values(row).join(CSV_SEPARATOR)),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "nouveaux_abonnes.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  console.log("link", link);
  link.click();
  document.body.removeChild(link);
};

const currentDate = new Date();
const previousMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
const previousMonthYear =
  currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();

const SubscribersForm = () => {
  const [loading, setLoading] = React.useState(false);
  const [subscribers, setSubscribers] = React.useState<any[]>([]);

  const [date, setDate] = React.useState({
    from: new Date(previousMonthYear, previousMonth, 1),
    to: new Date(),
  });

  React.useEffect(() => {
    const fetchSubscribers = async () => {
      if (date?.from && date?.to) {
        setLoading(true);
        const subscribers = await getLastSubscribers({ begin: date.from, end: date.to });
        setSubscribers(subscribers);
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, [date]);

  const SubscribersTable = (
    <div className='.shadow-lg self-stretch overflow-auto rounded-md bg-white px-6 py-4'>
      <Table>
        <TableCaption>Abonnés récents</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Code postal</TableHead>
            <TableHead>Ville</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.map(({ name, email, amount, adresse, code_postal, ville, id }) => (
            <TableRow key={id}>
              <TableCell className='font-medium'>{name}</TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>{amount / 100}€</TableCell>
              <TableCell>{adresse}</TableCell>
              <TableCell>{code_postal}</TableCell>
              <TableCell>{ville}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const DownloadButton = (
    <Button
      onClick={() =>
        downloadCSV(
          subscribers.map(({ name, email, amount, adresse, code_postal, ville }) => ({
            name,
            email,
            amount,
            adresse,
            code_postal,
            ville,
          })),
          ["Nom", "Email", "Montant", "Adresse", "Code postal", "Ville"],
        )
      }
      className='flex items-center gap-2 rounded-md bg-white text-zinc-900'
    >
      <IoIosDownload size={17} />
      <span> Télécharger </span>
    </Button>
  );

  const NewSubscribers = (
    <div className='flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-white shadow-lg'>
      <RiChatFollowUpFill />
      <p>{subscribers.length} nouveaux abonnés sur la période</p>
    </div>
  );

  const NoSubscribers = <p>Aucun nouvel abonné sur cette période 😭</p>;

  return (
    <div className='mx-auto flex max-h-[80vh] w-[90%] flex-col items-center justify-start gap-3 pt-12'>
      {!loading ? (
        <>
          <DatePickerWithRange date={date} setDate={setDate} />
          {subscribers.length > 0 ? SubscribersTable : NoSubscribers}
          <div className='flex items-center justify-between self-stretch'>
            {NewSubscribers}
            {DownloadButton}
          </div>
        </>
      ) : (
        <div className='flex grow items-center'>
          <SuperBallsLoader />
        </div>
      )}
    </div>
  );
};

export default SubscribersForm;
