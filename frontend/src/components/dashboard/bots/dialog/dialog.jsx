import {useState} from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { NewBotForm } from "./new-bot-form"
import { NewStrategyForm } from "./new-strategy-form"


export function UniversalDialog({open, onOpenChange, menu }) {
  const [mode, setMode] = useState(menu)
  const [lastStrategy, setLastStrategy] = useState(null)

  const handleBotSubmit = (data) => {
    console.log("✅ New bot created:", data)
    onOpenChange(false)
  }

  const handleStrategySubmit = (strategy) => {
    console.log("✅ New strategy created:", strategy)
    setLastStrategy(strategy.name) // сохраняем имя
    setMode("bots") // возвращаемся обратно в форму бота
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "bots" ? "Create New Bot" : "Create New Strategy"}
          </DialogTitle>
        </DialogHeader>

        {mode === "bots" ? (
          <div className="space-y-4">
            <NewBotForm onSubmit={handleBotSubmit} 
            onCancel={() => onOpenChange(false)}
            onAddStrategy={() => setMode("strategies")}
            preselectedStrategy={lastStrategy} />
          </div>
        ) : (
          <div className="space-y-4">
            <NewStrategyForm
            onSubmit={handleStrategySubmit}
            onCancel={() => setMode("bots")}
          />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
