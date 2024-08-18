import React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { fr } from "date-fns/locale";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// type DateRangePickerProps = {
//   className: string;
//   date: DateRange;
//   setDate: any;
// };

export const DatePickerWithRange: any = ({ className, date, setDate, footer }: any) => {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: fr })} - {format(date.to, "LLL dd, y", { locale: fr })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: fr })
              )
            ) : (
              <span className="text-muted-foreground">Choisir des dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            disabled={(date) => date > new Date() || date < new Date("2023-01-01")}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <span className="text-sm text-center text-accent-foreground">{footer}</span>
    </div>
  );
};
