"use client";

// 🔩 Base
import React from "react";

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
import { Button } from "@/ui/components/button";

// 🔧 Libs
import { prettifyName } from "@dashboard/utils/strings";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// ✅ Icons
import { ArrowUpDown } from "lucide-react";

// 🗿 Models
import { Customer } from "@dashboard/libs/stripe";

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "created",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='px-0 hover:bg-inherit hover:text-inherit'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const created = row.getValue("created") as unknown as Date;
      const formatted = created.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      return formatted;
    },
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => {
      const name = row.getValue("name") as unknown as string;
      return <span className='font-medium'>{prettifyName(name)}</span>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as unknown as string;
      return <a href={`mailto:${email}`}>{email}</a>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='px-0 hover:bg-inherit hover:text-inherit'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Montant
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amountInEuro = (row.getValue("amount") as unknown as number) / 100;
      const formattedAmount = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0, // No decimal
      }).format(amountInEuro);

      return formattedAmount;
    },
  },
  {
    accessorKey: "ville",
    header: "Ville",
    cell: ({ row }) => {
      const city = row.getValue("ville") as unknown as string;
      return <span className='capitalize'>{city.toLowerCase()}</span>;
    },
  },
  {
    accessorKey: "adresse",
    header: "Adresse",
  },
  {
    accessorKey: "code_postal",
    header: "Code postal",
  },
];

const SubscribersList = ({ subscribers }: { subscribers: Customer[] }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable<Customer>({
    data: subscribers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });
  // Early return if no subscribers loaded
  if (subscribers.length === 0) return <p>Aucun nouvel abonné sur cette période 😭</p>;

  return (
    <div className='mt-4 self-stretch overflow-auto rounded-md bg-white px-6 py-2 shadow-lg'>
      <Table>
        <TableCaption>Abonnés récents</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {/* ⬇️ Wrap it with <> </> to avoid type issue ⬇️ */}
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubscribersList;
