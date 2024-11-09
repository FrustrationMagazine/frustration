"use client";

// 📊 Charts
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/components/chart";
import { Area, AreaChart, XAxis, Legend } from "recharts";

// 🔧 Libs
import { inEuros } from "../../_utils";
import { formatExplicitDay } from "@/utils/dates";

// 🗿 Models
import { Transactions } from "../../_models";

const chartConfig = {
  income: {
    label: "Revenus",
  },
} satisfies ChartConfig;

const TransactionsChart = ({
  transactions,
}: {
  transactions: Transactions[];
}) => {
  const chartData = transactions.map(({ date, total }) => ({
    day: date.toISOString(),
    total: Math.round(total / 100),
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="w-full rounded-md bg-black/5 p-6 backdrop-blur-md [&_.recharts-cartesian-axis-tick_text]:fill-primary [&_.recharts-cartesian-axis-tick_text]:font-bold [&_.recharts-cartesian-axis-tick_text]:opacity-70"
    >
      <AreaChart accessibilityLayer data={chartData}>
        <defs>
          <linearGradient id="stripeGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#827cf8" stopOpacity={1} />
            <stop offset="100%" stopColor="#b5b2fb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          tickLine={false}
          angle={-45}
          axisLine={false}
          fontSize={14}
          padding={{ left: 40, right: 40 }}
          tickMargin={-20}
          stroke="#0f172a"
          tickFormatter={(value) => formatExplicitDay(value, "short")}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              valueFormatter={inEuros}
              xValue="day"
              formatterXValue={(value) => formatExplicitDay(value, "long")}
              labelKey="income"
            />
          }
        />
        <Area
          dataKey="total"
          type="monotone"
          fill="url(#stripeGradient)"
          stroke="#625bf6"
          radius={4}
          // Import to keep this dot property so dots are painted but invisible and we can check position of active dot within it whenever we want
          dot={{ fill: "transparent", strokeWidth: 0 }}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default TransactionsChart;
