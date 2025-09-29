import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export function NewStrategyForm({ onSubmit, onCancel, isFromBotForm, isEdit, data }) {
  const [name, setName] = useState("")
  const [lossLimit, setLossLimit] = useState("")
  const [incomeLimit, setIncomeLimit] = useState("")
  const [potentialIncomeLimit, setPotentialIncomeLimit] = useState("")
  const [recheckPeriod, setRecheckPeriod] = useState("")

  useEffect(() => {
    if (isEdit && data) {
      setName(data.name)
      setLossLimit(data.lossLimit)
      setIncomeLimit(data.incomeLimit)
      setPotentialIncomeLimit(data.potentialIncomeLimit)
      setRecheckPeriod(data.recheckPeriod)
    }
  }, [isEdit, data])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      name,
      lossLimit,
      incomeLimit,
      potentialIncomeLimit,
      recheckPeriod
    })
  }

  const isValid = name && (lossLimit && lossLimit > 0) && (incomeLimit && incomeLimit > 0) && (potentialIncomeLimit && potentialIncomeLimit > 0)&& (recheckPeriod && recheckPeriod > 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-muted-foreground">
                Define parameters for your new trading strategy.
        </p>
      <div className="grid gap-3 pt-3">
        <Label htmlFor="name">Strategy Name</Label>
        <Input
          id="name"
          placeholder="strategy_999"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
                A unique name to identify this strategy.s
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 py-3">
        <div className="grid gap-3 py-3">
          <Label htmlFor="loss">Loss Limit</Label>
          <Input
            id="loss"
            placeholder="0.05"
            value={lossLimit}
            onChange={(e) => setLossLimit(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
                Maximum allowed loss<br/> (e.g. 0.05 = 5%).
        </p>
        </div>

        <div className="grid gap-3 py-3">
          <Label htmlFor="income">Income Limit</Label>
          <Input
            id="income"
            placeholder="0.02"
            value={incomeLimit}
            onChange={(e) => setIncomeLimit(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
                Minimum profit target to <br/> close trades.
        </p>
        </div>

        <div className="grid gap-3 py-3">
          <Label htmlFor="potential">Potential Income Limit</Label>
          <Input
            id="potential"
            placeholder="0.005"
            value={potentialIncomeLimit}
            onChange={(e) => setPotentialIncomeLimit(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
                Potential profit to open a trade.<br/>(e.g. 0.002 = 0.2%).
        </p>
        </div>

        <div className="grid gap-3 py-3">
          <Label htmlFor="period">Recheck Period (min)</Label>
          <Input
            id="period"
            placeholder="5"
            value={recheckPeriod}
            onChange={(e) => setRecheckPeriod(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
                How often to recheck conditions (hours).
        </p>
        </div>
      </div>


      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {isFromBotForm ? <div className="justify-start" ><ArrowLeft className="h-4 w-4 mr-1" /> Back</div> : <>Cancel</>}
          </Button>
        )}
        <Button type="submit" disabled={!isValid}>Create Strategy</Button>
      </div>
    </form>
  )
}
