// 🧱 Components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/card";

// 🎨 Assets
import { Check } from "lucide-react";

const FormulaCard = ({
  id,
  name,
  amount,
  items,
  formula,
  setFormula,
}: {
  id: string;
  name: string;
  amount: number;
  items: string[];
  formula: string;
  setFormula: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <li className="transition-transform [&:has(input:checked)]:scale-105">
    <input
      id={id}
      type="radio"
      name="subscription"
      value={amount}
      className="group peer hidden appearance-none"
      checked={formula === id}
      onChange={() => setFormula(id)}
    />
    <label
      htmlFor={id}
      className="peer-checked block cursor-pointer rounded-lg peer-checked:bg-black peer-checked:text-yellow">
      <Card className="rounded-lg">
        <CardHeader className="font-montserrat mb-2 mt-4 px-5 py-0 text-2xl font-bold uppercase">
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent className="space-between flex items-center px-5 py-0">
          <ul className="flex-grow -space-y-1 text-base">
            {items.map((item: any) => (
              <li key={item.toLowerCase().replace(/\s/g, "")}>{item}</li>
            ))}
          </ul>
          <Check className="check-card" />
        </CardContent>
        <CardFooter className="mb-4 mt-2 px-5 py-0">
          <p>
            <span className="mr-1.5 text-3xl font-bold">{amount}€</span>
            <span className="text-sm">tous les mois</span>
          </p>
        </CardFooter>
      </Card>
    </label>
  </li>
);

export default FormulaCard;
