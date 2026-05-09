import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export function BotCard({ bot }) {
  return (
    <Card className="shadow-md overflow-hidden w-full bg-gradient-to-t from-primary/5 to-card dark:bg-card">
      <CardHeader className="flex flex-col gap-4 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <CardTitle className="relative inline-block">
                {/*<div className="flex items-end pb-1 text-white">
                    <Badge variant="primary" className="bg-pink-500">{bot.exchange}</Badge>
                    <Badge variant="primary" className="bg-blue-500 font-semibold">{bot.network}</Badge>
                </div>  https://app.uniswap.org/assets/arbitrum-logo-BlOPIBPb.png*/}
                <div className="text-2xl font-bold">{bot.name}</div>
                <img
                  src="/src/assets/arbitrum-logo.png"
                  alt={bot.exchange}
                  className="absolute -bottom-1 -right-2 w-4 h-4 rounded-sm border border-white shadow"
                />
              </CardTitle>
            </div>
            <div className="pt-1">
              <Badge variant="secondary" className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    bot.active ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {bot.active ? "Running" : "Stopped"}
              </Badge>
            </div>
          </div>
                
          {/* График справа — только на десктопах */}
          <div className="hidden lg:block h-[70px] w-[40%]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bot.balanceHistory} margin={{ left: 0, right: 0, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" hide />
                <Line type="monotone" dataKey="balance" stroke={bot.profitAbs >= 0 ? "#22c55e" : "#ef4444"} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div> 
                
        {/* График под названием — только на мобильных/планшетах */}
        <div className="lg:hidden h-[80px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bot.balanceHistory} margin={{ left: 0, right: 0, top: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" hide />
              
              <Line type="monotone" dataKey="balance" stroke={bot.profitAbs >= 0 ? "#22c55e" : "#ef4444"} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardHeader>

      {/* Footer with stats */}
      <Separator />
      <div className="px-6 text-sm grid grid-cols-2 gap-3 lg:flex lg:items-center lg:justify-between">
        {/* Initial */}
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-semibold">${bot.initial}</span>
          <span className="text-muted-foreground text-xs">Initial Deposit</span>
        </div>

        {/* Profit/Loss */}
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-semibold">
            {bot.profitAbs >= 0 ? `$${bot.profitAbs}` : `-$${Math.abs(bot.profitAbs)}`}
          </span>
          <span className="text-muted-foreground text-xs"> {bot.profitAbs >= 0 ? 'Profit' : 'Loss'}</span>
        </div>

        {/* APR */}
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-semibold">{bot.profitPct}%</span>
          <span className="text-muted-foreground text-xs">APR</span>
        </div>

        {/* Button */}
        <div className="flex flex-col leading-tight w-[115px]">
          <Button size="sm" variant="default">
            Explore More
          </Button>
        </div>
      </div>
    </Card>
  )
}
