"use client";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/components/chart";
import { Area, AreaChart, YAxis, XAxis, Legend, CartesianGrid } from "recharts";
import { inEuros, formatExplicitMonth, debounce } from "../_utils";
const chartConfig = {
  income: {
    label: "Revenus mensuels générés",
  },
  stripe: {
    label: "Stripe",
    color: "#574af9",
    // icon: Monitor,
  },
  helloasso: {
    label: "HelloAsso",
    color: "#2dce83",
  },
} satisfies ChartConfig;

const TransactionsChart = ({
  name,
  chartData,
  setHoveredMonth,
}: {
  name: string;
  chartData: any;
  setHoveredMonth: any;
}) => {
  const modifiedChartData = chartData
    .map(({ month, stripe, helloasso, total }: any) => ({
      month: month.toISOString(),
      stripe: Math.round(stripe),
      helloasso: Math.round(helloasso),
      total: Math.round(total),
    }))
    .slice(-12);

  function handleMouseMove() {
    const activeDot = document.querySelector(".recharts-active-dot circle");
    if (activeDot) {
      const activeDotX = activeDot?.getAttribute("cx");
      if (activeDotX) {
        const dots = Array.from(
          document.querySelectorAll(".recharts-area-dots circle"),
        ).toReversed();
        const dotsX = dots.map((dot) => dot.getAttribute("cx"));
        const matchingIndex = dotsX.findIndex((dotX) => dotX === activeDotX);
        setHoveredMonth(matchingIndex);
      }
    } else {
      setHoveredMonth(-1);
    }
  }

  return (
    <ChartContainer
      config={chartConfig}
      className='w-full rounded-md bg-black/5 p-6 backdrop-blur-md [&_.recharts-cartesian-axis-tick_text]:fill-primary [&_.recharts-cartesian-axis-tick_text]:font-bold [&_.recharts-cartesian-axis-tick_text]:opacity-70'
    >
      <AreaChart
        accessibilityLayer
        data={modifiedChartData}
        onMouseMove={debounce(handleMouseMove, 10)}
        onMouseLeave={() => setHoveredMonth(-1)}
      >
        <defs>
          <linearGradient id='stripeGradient' x1='0' x2='0' y1='0' y2='1'>
            <stop offset='0%' stopColor='#827cf8' stopOpacity={1} />
            <stop offset='100%' stopColor='#b5b2fb' stopOpacity={0} />
          </linearGradient>
          <linearGradient id='helloassoGradient' x1='0' x2='0' y1='0' y2='1'>
            <stop offset='0%' stopColor='#56c679' stopOpacity={1} />
            <stop offset='100%' stopColor='#8dd9a5' stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey='month'
          tickLine={false}
          angle={-45}
          axisLine={false}
          fontSize={14}
          padding={{ left: 40, right: 40 }}
          tickMargin={30}
          stroke='#0f172a'
          tickFormatter={(value) => formatExplicitMonth(value, "short")}
        />
        {/* <YAxis
          dataKey='stripe'
          unit='€'
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          fontSize={14}
          interval='preserveEnd'
          stroke='rgba(0,0,0,.5)'
          fill='red'
          padding={{ top: 0, bottom: 40 }}
          tickFormatter={(value: number) => Intl.NumberFormat("fr-Fr").format(value)}
        /> */}
        <ChartTooltip
          content={
            <ChartTooltipContent
              valueFormatter={inEuros}
              xValue='month'
              formatterXValue={(value) => formatExplicitMonth(value, "long")}
              labelKey='income'
            />
          }
        />
        <Area
          dataKey='stripe'
          type='monotone'
          fill='url(#stripeGradient)'
          stroke='#625bf6'
          radius={4}
          dot={{ fill: "transparent", strokeWidth: 0 }}
        />
        <Area
          dataKey='helloasso'
          type='monotone'
          fill='url(#helloassoGradient)'
          stroke='#359d55'
          radius={4}
        />
        <Legend
          iconType='plainline'
          iconSize={18}
          wrapperStyle={{ fontSize: 14, paddingTop: "60px", fontWeight: "bold" }}
          formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default TransactionsChart;
