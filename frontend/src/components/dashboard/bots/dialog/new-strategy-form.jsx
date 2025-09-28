import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"

export function NewStrategyForm({ onSubmit, onCancel, isFromBotForm }) {
  const [name, setName] = useState("")
  const [lossLimit, setLossLimit] = useState("")
  const [incomeLimit, setIncomeLimit] = useState("")
  const [potentialIncomeLimit, setPotentialIncomeLimit] = useState("")
  const [recheckPeriod, setRecheckPeriod] = useState("")
  const [autoSave, setAutoSave] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      name,
      lossLimit,
      incomeLimit,
      potentialIncomeLimit,
      recheckPeriod,
      autoSave
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3">
        <Label htmlFor="name">Strategy Name</Label>
        <Input
          id="name"
          placeholder="strategy_999"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="grid gap-3">
          <Label htmlFor="loss">Loss Limit</Label>
          <Input
            id="loss"
            placeholder="0.05"
            value={lossLimit}
            onChange={(e) => setLossLimit(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="income">Income Limit</Label>
          <Input
            id="income"
            placeholder="0.02"
            value={incomeLimit}
            onChange={(e) => setIncomeLimit(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="potential">Potential Income Limit</Label>
          <Input
            id="potential"
            placeholder="0.005"
            value={potentialIncomeLimit}
            onChange={(e) => setPotentialIncomeLimit(e.target.value)}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="period">Recheck Period (min)</Label>
          <Input
            id="period"
            placeholder="5"
            value={recheckPeriod}
            onChange={(e) => setRecheckPeriod(e.target.value)}
          />
        </div>
      </div>

        <Label
          htmlFor="autoSave"
          className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 
                     has-[[aria-checked=true]]:border-blue-600 
                     has-[[aria-checked=true]]:bg-blue-50 
                     dark:has-[[aria-checked=true]]:border-blue-900 
                     dark:has-[[aria-checked=true]]:bg-blue-950"
        >
          <Checkbox
            id="autoSave"
            checked={autoSave}
            onCheckedChange={(checked) => setAutoSave(!!checked)}
            className="data-[state=checked]:border-blue-600 
                       data-[state=checked]:bg-blue-600 
                       data-[state=checked]:text-white 
                       dark:data-[state=checked]:border-blue-700 
                       dark:data-[state=checked]:bg-blue-700"
          />
          <div className="grid gap-1.5 font-normal">
            <p className="text-sm leading-none font-medium">Auto save</p>
            <p className="text-muted-foreground text-sm">
              This strategy will be saved for new bots.
            </p>
          </div>
        </Label>


      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {isFromBotForm ? <div className="justify-start w-fit" ><ArrowLeft className="h-4 w-4 mr-1" /> Back</div> : <>Cancel</>}
          </Button>
        )}
        <Button type="submit">Create Strategy</Button>
      </div>
    </form>
  )
}
