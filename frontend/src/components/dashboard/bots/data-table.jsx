import * as React from "react"

import {
  IconPlus,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { BotTable } from "./bot-table"
import { StrategyTable } from "./strategy-table"
import { UniversalDialog } from "./dialog/dialog"
import {useState} from "react"

const demoData = [
  {
    id: 1,
    bot: "USDC/ETH",
    status: "Running",
    initial: "$5,000",
    profit: "+$750",
    balance: "$5750",
    strategy: "strategy_101",
  },
  {
    id: 2,
    bot: "USDT/WBTC",
    status: "Stopped",
    initial: "$2,500",
    profit: "-$120",
    balance: "$2380",
    strategy: "strategy_204",
  },
  {
    id: 3,
    bot: "DAI/ETH",
    status: "Stopped",
    initial: "$1,000",
    profit: "+$95",
    balance: "$1095",
    strategy: "strategy_309",
  },
  {
    id: 4,
    bot: "ARB/USDC",
    status: "Running",
    initial: "$3,200",
    profit: "+$410",
    balance: "$3610",
    strategy: "strategy_412",
  },
  {
    id: 5,
    bot: "WBTC/ETH",
    status: "Stopped",
    initial: "$7,500",
    profit: "-$600",
    balance: "$6900",
    strategy: "strategy_555",
  },
]

const demoStrategies = [
  {
    id: 1,
    name: "strategy_101",
    lossLimit: "0.10",
    incomeLimit: "0.02",
    potentialIncomeLimit: "0.006",
    recheckPeriod: "4",
    performance: "+12%",
  },
  {
    id: 2,
    name: "strategy_204",
    lossLimit: "0.05",
    incomeLimit: "0.04",
    potentialIncomeLimit: "0.002",
    recheckPeriod: "2",
    performance: "-4%",
  },
  {
    id: 3,
    name: "strategy_309",
    lossLimit: "0.02",
    incomeLimit: "0.03",
    potentialIncomeLimit: "0.004",
    recheckPeriod: "1",
    performance: "+2.5%",
  },
  {
    id: 4,
    name: "strategy_412",
    lossLimit: "0.08",
    incomeLimit: "0.02",
    potentialIncomeLimit: "0.002",
    recheckPeriod: "6",
    performance: "+8%",
  },
]


export default function DataTable() {

  const [activeTab, setActiveTab] = useState("bots")
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClick = () => {
    setDialogOpen(true)
    if (activeTab === "bots") {
      console.log("Create new bot")
      // тут логика создания бота
    } else if (activeTab === "strategies") {
      console.log("Create new strategy")
      // тут логика создания стратегии
    }
  }

  return (
    <>
    <Tabs defaultValue="bots" 
      value={activeTab}
      onValueChange={setActiveTab} 
      className="w-full flex-col gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList>
          <TabsTrigger value="bots">Bots</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm" onClick={handleClick}>
          <IconPlus />
          <span className="ml-2">{activeTab === "bots" ? "New Bot" : "New Strategy"}</span>
        </Button>
      </div>

      <TabsContent value="bots" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <BotTable data={demoData} />
      </TabsContent>

      <TabsContent value="strategies" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <StrategyTable data={demoStrategies} />
      </TabsContent>
    </Tabs>

    <UniversalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        menu={activeTab}
    />
    </>
  )
}
