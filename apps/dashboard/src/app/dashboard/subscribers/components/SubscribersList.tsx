"use client";

// 🧱 Components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/components/table";

// 🔧 Libs
import { prettifyName } from "@dashboard/utils/strings";

// 🗿 Models
import { Customer } from "@dashboard/libs/stripe";

const SubscribersList = ({ subscribers }: { subscribers: Customer[] }) => {
  // Early return if no subscribers loaded
  if (subscribers.length === 0) return <p>Aucun nouvel abonné sur cette période 😭</p>;

  return (
    <div className='mt-4 self-stretch overflow-auto rounded-md bg-white px-6 py-4 shadow-lg'>
      <Table>
        <TableCaption>Abonnés récents</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Code postal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.map(({ created, name, email, amount, adresse, code_postal, ville, id }) => (
            <TableRow key={id}>
              <TableCell>
                {created.toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className='font-medium'>{prettifyName(name)}</TableCell>
              <TableCell>
                <a href={`mailto:${email}`}>{email}</a>
              </TableCell>
              <TableCell>{amount / 100}€</TableCell>
              <TableCell>{adresse}</TableCell>
              <TableCell className='capitalize'>{ville.toLowerCase()}</TableCell>
              <TableCell>{code_postal}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubscribersList;
