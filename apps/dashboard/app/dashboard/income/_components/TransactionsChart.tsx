"use client";

import React from "react";
import { Monitor } from "lucide-react";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/ui/components/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
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

const TransactionsChart = ({ chartData }) => {
  const modifiedChartData = chartData
    .map(({ month, stripe, helloasso, total }) => ({
      month: month.toISOString(),
      stripe: Math.round(stripe),
      helloasso: Math.round(helloasso),
      total: Math.round(total),
    }))
    .slice(-24);

  console.log("modifiedChartData", modifiedChartData);
  return (
    <ChartContainer
      config={chartConfig}
      className='min-h-[400px] w-full min-w-[1200px] [&_.recharts-cartesian-axis-tick_text]:fill-primary [&_.recharts-cartesian-axis-tick_text]:font-medium [&_.recharts-cartesian-axis-tick_text]:opacity-70'
    >
      <AreaChart accessibilityLayer data={modifiedChartData}>
        {/* <CartesianGrid strokeDasharray='2 2' vertical={false} stroke='#1e293b' /> */}
        <defs>
          <linearGradient id='stripeGradient' x1='0' x2='0' y1='0' y2='1'>
            <stop offset='0%' stopColor='#827cf8' stopOpacity={1} />
            <stop offset='100%' stopColor='#b5b2fb' stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id='helloassoGradient' x1='0' x2='0' y1='0' y2='1'>
            <stop offset='0%' stopColor='#56c679' stopOpacity={1} />
            <stop offset='100%' stopColor='#8dd9a5' stopOpacity={0.1} />
          </linearGradient>
        </defs>
        {/* <XAxis
          dataKey='month'
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          fontSize={14}
          interval='equidistantPreserveStart'
          padding={{ left: 40, right: 0 }}
          stroke='#0f172a'
          tickFormatter={(value: string) => {
            const explicitMonth = new Date(value).toLocaleDateString("fr-FR", {
              month: "short",
              year: "numeric",
            });
            return "☀️ " + explicitMonth.charAt(0).toUpperCase() + explicitMonth.slice(1);
          }}
        /> */}
        <YAxis
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
        />
        <ChartTooltip
          cursor={{ stroke: "red", strokeWidth: 2 }}
          content={<ChartTooltipContent />}
        />
        {/* <ChartLegend content={<ChartLegendContent />} /> */}

        <Area
          dataKey='stripe'
          type='monotone'
          fill='url(#stripeGradient)'
          stroke='#625bf6'
          radius={4}
        />
        <Area
          dataKey='helloasso'
          type='monotone'
          fill='url(#helloassoGradient)'
          stroke='#359d55'
          radius={4}
        />

        {/* <Area dataKey='helloasso' fill='var(--color-mobile)' radius={4} /> */}
      </AreaChart>
    </ChartContainer>
  );
};

export default TransactionsChart;
