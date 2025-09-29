import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert"
import { Loader2Icon } from "lucide-react"
import { Terminal } from "lucide-react"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function NewBotForm({ onSubmit, onCancel, onAddStrategy, dataStrategy, models }) {
  const [pair, setPair] = useState("")
  const [initial, setInitial] = useState("")
  const [strategy, setStrategy] = useState("")
  const [wallet, setWallet] = useState(null)
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null)
  const [isStrategyOpen, setIsStrategyOpen] = useState(false)

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError({
        title: "Wallet not found",
        description: "Please install MetaMask or Rabby Wallet.",
      })
      return
    }

    setConnecting(true)
    setError(null)

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      console.log("✅ Accounts:", accounts)
      
      setWallet(accounts[0])
      console.log("✅ Connected:", accounts[0])
    } catch (err) {
      if (err.code === 4001) {
        setError({
          title: "Connection rejected",
          description: "You declined the wallet connection request.",
        })
      } else {
        setError({
          title: "Error",
          description: err.message,
        })
      }
    } finally {
      setConnecting(false)
    }
  }
  
  const isValid = pair && (initial && initial > 0) && strategy && wallet

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ pair, initial, strategy })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-muted-foreground">
                Fill in the fields to launch a new trading bot.
        </p>
       <div className="grid gap-3 py-3">
        <Label htmlFor="pair">Trading Pair</Label>
        <Select onValueChange={setPair}>
          <SelectTrigger id="pair" className="w-full h-10">
            <SelectValue placeholder="e.g. USDC/ETH" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
                Choose the market pair for your bot.
        </p>
      </div>

      <div className="grid gap-3 pb-3">
        <Label htmlFor="initial">Initial Deposit</Label>
        <p className="text-sm text-muted-foreground">
                Enter how much you want to fund the bot with and connect your wallet.
        </p>
        <div className="relative">
          <Input
            id="initial"
            placeholder="500"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            className="pr-16" // делаем отступ справа, чтобы текст не налезал
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
            USDC
          </span>
        </div>
        {wallet ? (
                <div className="p-3 bg-secondary border rounded-md flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground font-bold">Connected Wallet</span>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-mono">
                      {wallet.slice(0, 6)}...{wallet.slice(-4)}
                    </span>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setWallet(null)
                        setConnecting(false)
                      }}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Button type="button" variant="secondary" onClick={connectWallet}>
                    {connecting ? (<><Loader2Icon className="animate-spin" /> Connecting...</>) :( <>Connect Wallet</> )}
                  </Button>

                    {error && (
                      <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>{error.title}</AlertTitle>
                        <AlertDescription>{error.description}</AlertDescription>
                      </Alert>
                    )}
                  </div>
              )}
      </div>

      <div className={`grid gap-3 pb-3 ${isStrategyOpen ? "pb-24" : ""}`}>
        <Label htmlFor="strategy">Strategy</Label>
        <Select onValueChange={setStrategy} onOpenChange={setIsStrategyOpen}>
          <SelectTrigger id="strategy" className="w-full h-10">
            <SelectValue placeholder="Choose strategy..." />
          </SelectTrigger>
          <SelectContent side="bottom" position="popper" avoidCollisions={false}>
            {dataStrategy.map((strategy) => (
              <SelectItem key={strategy.id} value={strategy.name}>
                {strategy.name}
              </SelectItem>
            ))}

            <Separator className="my-1"/>
            <Button
              type="button"
              variant="ghost" 
              className="w-full flex items-center justify-start py-1.5 hover:bg-accent rounded-md"
              onClick={onAddStrategy}
              >
              <Plus className="h-4 w-4" /> New Strategy
            </Button>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
                Select or create a trading strategy.
        </p>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!isValid}>Create</Button>
      </div>
    </form>
  )
}
