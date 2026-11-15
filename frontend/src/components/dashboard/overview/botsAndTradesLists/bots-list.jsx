import * as React from "react"
import { BotCard } from "@/components/dashboard/overview/botsAndTradesLists/bot-card"

export function BotsList({data: bots }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {bots.map((bot) => (
        <BotCard key={bot.id} bot={bot} />
      ))}
    </div>
  )
}