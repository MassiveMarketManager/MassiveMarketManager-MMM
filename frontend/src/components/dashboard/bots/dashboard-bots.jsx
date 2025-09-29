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


export default function DashboardBots() {

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

  const [selectedBot, setSelectedBot] = useState(null)
  const [selectedStrategy, setSelectedStrategy] = useState(null)

  const [models, setModels] = useState(["USDC/ETH", "USDT/WBTC", "DAI/ETH"])

  const handleSelectBot = (bot, aktion) => {
    setSelectedBot(bot)
    setAction(aktion)
    setDialogOpen(true)
  }

  const handleSelectStrategy = (startegy, aktion) => {
    setSelectedStrategy(startegy)
    setAction(aktion)
    setDialogOpen(true)
  }

  // Create a new bot and send it to the backend
  const handleNewBot = async (data) => {
    try {
      // Example: call backend API to create a bot
      // const response = await fetch("/api/bots", { method: "POST", body: JSON.stringify(data) })
      // const newBot = await response.json()

      // Temporary local update (mock before backend integration)
      setBots((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          bot: data.pair,
          status: "Running",
          initial: "$" + data.initial,
          profit: "+$0",
          balance: "$" + data.initial,
          strategy: data.strategy,
        },
      ])
    } catch (err) {
      console.error("❌ Failed to create bot:", err)
    }
  }

  // Create a new strategy and send it to the backend
  const handleNewStrategy = async (data) => {
    try {
      // Example: call backend API to create a strategy
      // const response = await fetch("/api/strategies", { method: "POST", body: JSON.stringify(data) })
      // const newStrategy = await response.json()

      // Temporary local update
      setStrategies((prev) => [
        ...prev,
        { id: prev.length + 1, performance: "+0%", ...data },
      ])
    } catch (err) {
      console.error("❌ Failed to create strategy:", err)
    }
  }

  // Update an existing bot with new data
  const handleUpdateBot = async (updatedBot) => {
    try {
      // Example: call backend API to update a bot
      // await fetch(`/api/bots/${updatedBot.id}`, { method: "PUT", body: JSON.stringify(updatedBot) })

      // Temporary local update
      setBots((prev) =>
        prev.map((b) => (b.id === updatedBot.id ? updatedBot : b))
      )
    } catch (err) {
      console.error("❌ Failed to update bot:", err)
    }
  }

  // Update an existing strategy with new data
  const handleUpdateStartegy = async (updatedStrategy) => {
    try {
      // Example: call backend API to update a strategy
      // await fetch(`/api/strategies/${updatedStrategy.id}`, { method: "PUT", body: JSON.stringify(updatedStrategy) })

      // Temporary local update
      setStrategies((prev) =>
        prev.map((s) => (s.id === updatedStrategy.id ? updatedStrategy : s))
      )
    } catch (err) {
      console.error("❌ Failed to update strategy:", err)
    }
  }

  // Top up a bot’s balance (deposit funds)
  const handleTopUpBot = async (data) => {
    // data = { botId, amount, wallet }
    console.log("🔼 Top up request:", data)
    try {
      // Example: call backend API to top up
      // await fetch(`/api/bots/${data.botId}/topup`, { method: "POST", body: JSON.stringify(data) })

      // Temporary local update
      setBots((prev) =>
        prev.map((bot) =>
          bot.id === data.botId
            ? {
                ...bot,
                balance:
                  "$" +
                  (parseFloat(bot.balance.replace("$", "")) +
                    parseFloat(data.amount)),
              }
            : bot
        )
      )
    } catch (err) {
      console.error("❌ Failed to top up bot:", err)
    }
  }

  // Withdraw funds from a bot’s balance
  const handleWithdrawBot = async (data) => {
    // data = { botId, amount, wallet }
    console.log("🔽 Withdraw request:", data)
    try {
      // Example: call backend API to withdraw
      // await fetch(`/api/bots/${data.botId}/withdraw`, { method: "POST", body: JSON.stringify(data) })

      // Temporary local update
      setBots((prev) =>
        prev.map((bot) =>
          bot.id === data.botId
            ? {
                ...bot,
                balance:
                  "$" +
                  (parseFloat(bot.balance.replace("$", "")) -
                    parseFloat(data.amount)),
              }
            : bot
        )
      )
    } catch (err) {
      console.error("❌ Failed to withdraw from bot:", err)
    }
  }

  const handleStopRunBot = async (bot) => {
    try {
      // Example: call backend API to toggle status
      // await fetch(`/api/bots/${bot.id}/toggle`, { method: "POST" })

      // Temporary local update
      setBots((prev) =>
        prev.map((b) =>
          b.id === bot.id
            ? { ...b, status: b.status === "Running" ? "Stopped" : "Running" }
            : b
        )
      )
    } catch (err) {
      console.error("❌ Failed to toggle bot status:", err)
    }
  }

  // Delete a strategy permanently
  const handleDeleteStrategy = async (strategy) => {
    try {
      // Example: call backend API to delete the strategy
      // await fetch(`/api/strategies/${strategy.id}`, { method: "DELETE" })

      // Temporary local update
      setStrategies((prev) => prev.filter((s) => s.id !== strategy.id))
    } catch (err) {
      console.error("❌ Failed to delete strategy:", err)
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
        <Button variant="outline" size="sm" onClick={() => {
          setAction("new")
          setDialogOpen(true)
        }}>
          <IconPlus />
          <span className="ml-2">{activeTab === "bots" ? "New Bot" : "New Strategy"}</span>
        </Button>
      </div>

      <TabsContent value="bots" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <BotTable data={bots} openDialog={setDialogOpen} onRun={handleStopRunBot} onSelect={handleSelectBot} />
      </TabsContent>

      <TabsContent value="strategies" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <StrategyTable data={strategies} openDialog={setDialogOpen} onSelect={handleSelectStrategy} />
      </TabsContent>
    </Tabs>

    <UniversalDialog
        dataStrategy={strategies}
        handleNewStrategy={handleNewStrategy}
        handleNewBot={handleNewBot}
        handleUpdateBot={handleUpdateBot} 
        handleUpdateStartegy={handleUpdateStartegy}
        handleTopUpBot={handleTopUpBot}
        handleWithdrawBot={handleWithdrawBot}
        handleStopRunBot={handleStopRunBot}
        handleDeleteStrategy={handleDeleteStrategy}
        models={models}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={activeTab}
        action={action}
        selectedBot={selectedBot}
        selectedStrategy={selectedStrategy}
    />
    </>
  )
}
