import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Play, Square, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

export function EditBotForm({ bot, dataStrategy, onSubmit, onCancel, setAction }) {
  const [status, setStatus] = useState(bot.status || "Running")
  const [strategy, setStrategy] = useState(bot.strategy || "")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...bot, status, strategy })
    onCancel()
  }

  const isValid = status && strategy

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Update bot settings or switch to top up / withdraw forms.
      </p>

      <div className="grid gap-3 py-3">
          <Label htmlFor="pair">Trading Pair</Label>
          <Select disabled value={bot.bot}>
            <SelectTrigger id="pair" className="w-full h-10" disabled>
              <SelectValue>{bot.bot}</SelectValue>
            </SelectTrigger>
          </Select>
          <p className="text-sm text-muted-foreground">
            The trading pair cannot be changed. If you want a different pair, {" "}
            <button
              type="button"
              onClick={() => setAction("new")}
              className="underline text-primary hover:text-primary/80"
            >
              create a new bot
            </button>.
          </p>
        </div>

      {/* Status */}
      <div className="grid gap-3 pb-3">
          <Label htmlFor="status">Status</Label>

          <div className="flex items-center justify-between rounded-md border bg-muted/30 px-4 py-3">
            <Badge variant="secondary" className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  status === "Running" ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {status}
            </Badge>
            
            <Button
              type="button"
              size="sm"
              className="px-6 min-w-[120px] flex items-center justify-center"
              variant="outline"/*{status === "Running" ? "destructive" : "default"}*/
              onClick={() => setStatus(status === "Running" ? "Stopped" : "Running")}
            >
              {status === "Running" ? (
                  <>
                    <Square className="h-4 w-4 text-red-500" />
                    <span className="leading-none">Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 text-green-500" />
                    <span className="leading-none">Run</span>
                  </>
                )}
            </Button>
          </div>
            
          <p className="text-sm text-muted-foreground">
            Manage whether the bot is actively trading.
          </p>
        </div>

        <div className="grid gap-3 pb-3">
            <Label htmlFor="status">Funds Management</Label>

            <div className="p-3 rounded-md border bg-muted/30 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Balance</span>
              <span className="text-base font-semibold">{bot.balance}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                className="h-10 w-full flex items-center justify-center gap-2 rounded-md"
                variant="secondary"
                onClick={() => setAction("topup")}
              >
                <ArrowUpCircle className="h-6 w-6 text-green-500" />
                <span className="text-sm font-medium">Top Up</span>
              </Button>

              <Button
                type="button"
                className="h-10 w-full flex items-center justify-center gap-2 rounded-md"
                variant="outline"
                onClick={() => setAction("withdraw")}
              >
                <ArrowDownCircle className="h-6 w-6 text-red-500" />
                <span className="text-sm font-medium">Withdraw</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
                Add funds to increase the bot’s balance or withdraw profits anytime.
            </p>
        </div>
        



      {/* Strategy */}
      <div className="grid gap-3">
        <Label htmlFor="strategy">Strategy</Label>
        <Select value={strategy} onValueChange={setStrategy}>
          <SelectTrigger id="strategy" className="w-full h-10">
            <SelectValue placeholder="Select strategy..." />
          </SelectTrigger>
          <SelectContent>
            {dataStrategy.map((s) => (
              <SelectItem key={s.id} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Assign a trading strategy to this bot.
        </p>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!isValid}>Save Changes</Button>
      </div>
    </form>
  )
}
