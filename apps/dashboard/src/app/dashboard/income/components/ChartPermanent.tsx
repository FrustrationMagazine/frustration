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
import { inEuros, debounce } from "../_utils";
import { formatExplicitMonth } from "@/utils/dates";

// 🗿 Models
import { Transactions } from "../_models";

const chartConfig = {
  income: {
    label: "Revenus mensuels générés",
  },
} satisfies ChartConfig;

const TransactionsChart = ({
  transactions,
  setHighlightedMonth,
}: {
  transactions: Transactions[];
  setHighlightedMonth: any;
}) => {
  const NUMBER_OF_LAST_MONTHS_TO_DISPLAY = 12;

  const chartData = transactions
    .map(({ date, stripe, helloasso, total }) => ({
      month: date.toISOString(),
      stripe: Math.round(stripe),
      helloasso: Math.round(helloasso),
      total: Math.round(total),
    }))
    .slice(-NUMBER_OF_LAST_MONTHS_TO_DISPLAY);

  function handleMouseMove() {
    const RECHARTS_ACTIVE_DOT_CIRCLE_SELECTOR = ".recharts-active-dot circle";
    const RECHARTS_DOT_CIRCLE_SELECTOR = ".recharts-area-dots circle";

    const activeDot = document.querySelector(
      RECHARTS_ACTIVE_DOT_CIRCLE_SELECTOR,
    );
    if (!activeDot) setHighlightedMonth(-1);
    if (activeDot) {
      const activeDotPositionX = activeDot?.getAttribute("cx");
      if (activeDotPositionX) {
        const dots = Array.from(
          document.querySelectorAll(RECHARTS_DOT_CIRCLE_SELECTOR),
        ).toReversed();
        const dotsPositionX = dots.map((dot) => dot.getAttribute("cx"));
        const indexMonth = dotsPositionX.findIndex(
          (dotX) => dotX === activeDotPositionX,
        );
        setHighlightedMonth(indexMonth);
      }
    }
  }

  function resetHighlightedMonth() {
    setHighlightedMonth(-1);
  }

  /* ************** */
  /*     🚀 UI      */
  /* ************** */

  return (
    <section className="relative w-full rounded-md">
      <ChartContainer
        config={chartConfig}
        className="w-full rounded-md bg-black/5 p-6 backdrop-blur-md [&_.recharts-cartesian-axis-tick_text]:fill-primary [&_.recharts-cartesian-axis-tick_text]:font-bold [&_.recharts-cartesian-axis-tick_text]:opacity-70"
      >
        <AreaChart
          accessibilityLayer
          data={chartData}
          onMouseMove={debounce(handleMouseMove, 10)}
          onMouseLeave={resetHighlightedMonth}
        >
          <defs>
            <linearGradient id="stripeGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#827cf8" stopOpacity={1} />
              <stop offset="100%" stopColor="#b5b2fb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="helloassoGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#56c679" stopOpacity={1} />
              <stop offset="100%" stopColor="#8dd9a5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tickLine={false}
            angle={-45}
            axisLine={false}
            fontSize={14}
            padding={{ left: 40, right: 40 }}
            tickMargin={30}
            stroke="#0f172a"
            tickFormatter={(value) => formatExplicitMonth(value, "short")}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                valueFormatter={inEuros}
                xValue="month"
                formatterXValue={(value) => formatExplicitMonth(value, "long")}
                labelKey="income"
              />
            }
          />
          <Area
            dataKey="stripe"
            type="monotone"
            fill="url(#stripeGradient)"
            stroke="#625bf6"
            radius={4}
            // Import to keep this dot property so dots are painted but invisible and we can check position of active dot within it whenever we want
            dot={{ fill: "transparent", strokeWidth: 0 }}
          />
          <Area
            dataKey="helloasso"
            type="monotone"
            fill="url(#helloassoGradient)"
            stroke="#359d55"
            radius={4}
          />
          <Legend
            iconType="plainline"
            iconSize={18}
            wrapperStyle={{
              fontSize: 14,
              paddingTop: "60px",
              fontWeight: "bold",
            }}
            formatter={(value) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
};

export default TransactionsChart;
