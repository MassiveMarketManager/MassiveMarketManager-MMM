import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A simple balance chart"

const chartData = [
  { date: "2024-04-01", balance: 222 },
  { date: "2024-04-02", balance: 97 },
  { date: "2024-04-03", balance: 167 },
  { date: "2024-04-04", balance: 242 },
  { date: "2024-04-05", balance: 373 },
  { date: "2024-04-06", balance: 301 },
  { date: "2024-04-07", balance: 245 },
  { date: "2024-04-08", balance: 409 },
  { date: "2024-04-09", balance: 59 },
  { date: "2024-04-10", balance: 261 },
  // ... остальные записи можно оставить
  { date: "2024-06-30", balance: 446 },
]

const chartConfig = {
  balance: {
    label: "Balance",
    color: "var(--primary)",
  },
}

export function ChartArea() {
  const isMobile = useIsMobile()
  const [data, setData] = useState(chartData)

  // Можно оставить useEffect, если хочешь динамику для mobile
  useEffect(() => {
    if (isMobile) {
      // например, показывать только последние 7 дней
      const last7 = chartData.slice(-7)
      setData(last7)
    } else {
      setData(chartData)
    }
  }, [isMobile])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Balance</CardTitle>
        <CardDescription>
          <span>Total balance over period</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="balance"
              type="natural"
              fill="url(#fillBalance)"
              stroke="var(--primary)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
