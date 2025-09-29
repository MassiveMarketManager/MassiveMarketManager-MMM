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
import { useState } from "react"


export default function BotsDataTable() {

  const [activeTab, setActiveTab] = useState("bots")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [action, setAction] = useState("new")

  const [bots, setBots] = useState([
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
  ])

  const [strategies, setStrategies] = useState([
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
    {
      id: 5,
      name: "strategy_309",
      lossLimit: "0.02",
      incomeLimit: "0.03",
      potentialIncomeLimit: "0.004",
      recheckPeriod: "1",
      performance: "+2.5%",
    },
    {
      id: 6,
      name: "strategy_412",
      lossLimit: "0.08",
      incomeLimit: "0.02",
      potentialIncomeLimit: "0.002",
      recheckPeriod: "6",
      performance: "+8%",
    },
    {
      id: 7,
      name: "strategy_309",
      lossLimit: "0.02",
      incomeLimit: "0.03",
      potentialIncomeLimit: "0.004",
      recheckPeriod: "1",
      performance: "+2.5%",
    },
    {
      id: 8,
      name: "strategy_412",
      lossLimit: "0.08",
      incomeLimit: "0.02",
      potentialIncomeLimit: "0.002",
      recheckPeriod: "6",
      performance: "+8%",
    },
    {
      id: 9,
      name: "strategy_309",
      lossLimit: "0.02",
      incomeLimit: "0.03",
      potentialIncomeLimit: "0.004",
      recheckPeriod: "1",
      performance: "+2.5%",
    },
    {
      id: 10,
      name: "strategy_412",
      lossLimit: "0.08",
      incomeLimit: "0.02",
      potentialIncomeLimit: "0.002",
      recheckPeriod: "6",
      performance: "+8%",
    },
  ])

  const [selectedBotForEdit, setSelectedBotForEdit] = useState(null)
  const [selectedStrategyForEdit, setSelectedStrategyForEdit] = useState(null)

  const [models, setModels] = useState(["USDC/ETH", "USDT/WBTC", "DAI/ETH"])

  const handleClickCreateButton = () => {
    setAction("new")
    setDialogOpen(true)
  }

  const handleClickDestructiveButton = () => {
    setAction("destructive")
    setDialogOpen(true)
  }

  const handleSelectBotForEdit = (bot) => {
    setSelectedBotForEdit(bot)
    setAction("edit")
    setDialogOpen(true)
  }

  const handleSelectStrategyForEdit = (startegy) => {
    setSelectedStrategyForEdit(startegy)
    setAction("edit")
    setDialogOpen(true)
  }

  const handleNewBot = (data) => {
    setBots((prev) => [
      ...prev,
      { id: prev.length + 1, bot: data.pair, status: "Running",initial: "$" + data.initial, profit: "+$0", balance: "$" + data.initial, strategy: data.strategy },
    ])
  }

  const handleNewStrategy = (data) => {
    console.log("✅ New strategy created:", data)
    setStrategies((prev) => [
      ...prev,
      { id: prev.length + 1, performance: "+0%", ...data },
    ])
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
        <Button variant="outline" size="sm" onClick={handleClickCreateButton}>
          <IconPlus />
          <span className="ml-2">{activeTab === "bots" ? "New Bot" : "New Strategy"}</span>
        </Button>
      </div>

      <TabsContent value="bots" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <BotTable data={bots} onStop={handleClickDestructiveButton} onEdit={handleSelectBotForEdit} />
      </TabsContent>

      <TabsContent value="strategies" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <StrategyTable data={strategies} onDelete={handleClickDestructiveButton} onEdit={handleSelectStrategyForEdit} />
      </TabsContent>
    </Tabs>

    <UniversalDialog
        dataStrategy={strategies}
        handleNewStrategy={handleNewStrategy}
        handleNewBot={handleNewBot}
        models={models}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={activeTab}
        action={action}
        selectedBotForEdit={selectedBotForEdit}
        selectedStrategyForEdit={selectedStrategyForEdit}
    />
    </>
  )
}
