import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert"
import { Loader2Icon, Terminal } from "lucide-react"

export function TopUpForm({ bot, onSubmit, onCancel }) {
  const [amount, setAmount] = useState("")
  const [wallet, setWallet] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)

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
      setWallet(accounts[0])
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ botId: bot.id, amount })
    onCancel()
  }

  const isValid = amount && amount > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Add funds to your bot’s balance to increase its trading capacity.
      </p>

      <div className="p-3 rounded-md border bg-muted/20  flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Balance</span>
            <span className="text-base font-semibold">{bot.balance}</span>
        </div>

      <div className="grid gap-3 pb-3">
        <Label htmlFor="initial">Amount</Label>
        <p className="text-sm text-muted-foreground">
                Enter the amount you want to deposit.
        </p>
        

        <div className="relative">
          <Input
            id="initial"
            placeholder="500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pr-16"
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

      
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!isValid}>Top Up</Button>
      </div>
    </form>
  )
}
