"use client";

// 🔩 Base
import React from "react";

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
  const [dataType, setDataType] = React.useState("total");

  let cumul = 0;
  const chartData = transactions.map(({ date, total }) => {
    cumul += total;
    return {
      day: date.toISOString(),
      total: total,
      cumul,
    };
  });

  return (
    <section className="relative w-full rounded-md">
      <div className="absolute left-3 top-3 z-10 flex gap-3 rounded-sm px-3 py-2 text-lg font-semibold text-black/90 accent-black/90">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            onChange={() => setDataType("total")}
            type="radio"
            checked={dataType === "total"}
            name="dataType"
            id="total"
          />
          Total
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            onChange={() => setDataType("cumul")}
            checked={dataType === "cumul"}
            type="radio"
            name="dataType"
            id="cumul"
          />
          Cumul
        </label>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-full w-full rounded-md bg-black/5 p-6 backdrop-blur-md [&_.recharts-cartesian-axis-tick_text]:fill-primary [&_.recharts-cartesian-axis-tick_text]:font-bold [&_.recharts-cartesian-axis-tick_text]:opacity-70"
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
            dataKey={dataType}
            type="monotone"
            fill="url(#stripeGradient)"
            stroke="#625bf6"
            radius={4}
            // Import to keep this dot property so dots are painted but invisible and we can check position of active dot within it whenever we want
            dot={{ fill: "transparent", strokeWidth: 0 }}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
};

export default TransactionsChart;
