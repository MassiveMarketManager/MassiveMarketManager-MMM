import * as React from "react"
import {TradeCard} from "@/components/dashboard/overview/botsAndTradesLists/trade-card.jsx"

export function TradesList({data: trades}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {trades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} />
      ))}
    </div>
  )
}