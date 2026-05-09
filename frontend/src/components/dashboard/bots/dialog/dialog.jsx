import {useState, useEffect} from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { NewBotForm } from "./new-bot-form"
import { NewStrategyForm } from "./new-strategy-form"
import { MessageForm } from "./message-form"
import { EditBotForm } from "./edit-bot-form"
import { TopUpForm } from "./topup-form"
import { WithdrawForm } from "./withdraw-form"

/*const dialogForms = {
  bots: {
    new_bot: {
      title: "Create New Bot",
      component: NewBotForm,
    },
    new_strategy: {
      title: "Create Strategy for Bot",
      component: NewStrategyForm,
    },
    edit: {
      title: "Edit Bot",
      component: () => <div>Edit Bot Form</div>,
    },
    payout: {
      title: "Payout Bot",
      component: () => <div>Payout Form</div>,
    },
    top_up: {
      title: "Top Up Bot",
      component: () => <div>Top Up Form</div>,
    },
    delete: {
      title: "Delete Bot",
      component: () => <div>Delete Bot Form</div>,
    },
  },
  strategies: {
    new_strategy: {
      title: "Create New Strategy",
      component: NewStrategyForm,
    },
    edit: {
      title: "Edit Strategy",
      component: () => <div>Edit Strategy Form</div>,
    },
    delete: {
      title: "Delete Strategy",
      component: () => <div>Delete Strategy Form</div>,
    },
  },
}*/


export function UniversalDialog({
  dataStrategy,
  handleNewStrategy,
  handleNewBot,
  handleUpdateBot,
  handleUpdateStartegy,
  handleTopUpBot,
  handleWithdrawBot,
  handleStopRunBot,
  handleDeleteStrategy,
  models,
  open, 
  onOpenChange, 
  mode: initialMode, 
  action: initialAction,
  selectedBot,
  selectedStrategy }) {

  const [mode, setMode] = useState(initialMode)
  const [action, setAction] = useState(initialAction)

  useEffect(() => {
    if (open) {
      setMode(initialMode)
      setAction(initialAction)
    }
  }, [open, initialMode, initialAction])

  const handleStrategyFromBotSubmit = (strategy) => {
    handleNewStrategy(strategy)
    setMode("bots") 
  }

  const forms = {
    bots: {
      new: {
        title: "Create New Bot",
        component: (
          <NewBotForm 
              onSubmit={handleNewBot} 
              onCancel={() => onOpenChange(false)}
              dataStrategy={dataStrategy}
              models={models}
              onAddStrategy={() => setAction("new_strategy")}
               />
        ),
      },
      new_strategy: {
        title: "Create Strategy for Bot",
        component: (<NewStrategyForm
              onSubmit={handleStrategyFromBotSubmit }
              onCancel={() => setAction("new")}
              isFromBotForm={true}
              isEdit={false}
            />),
      },
      destructive: {
        title: "Stop this Bot",
        component: (<MessageForm
              onSubmit={() => {
                handleStopRunBot(selectedBot)
                onOpenChange(false)
              }}
              onCancel={() => onOpenChange(false) }
              text="Are you sure you want to stop this bot? It will stop trading immediately but your funds remain safe."
              submitButtonText="Stop"
            />),
      },
      edit: {
        title: "Edit this Bot",
        component: (<EditBotForm
          bot={selectedBot}
          dataStrategy={dataStrategy}
          onSubmit={handleUpdateBot}
          onCancel={() => onOpenChange(false)}
          setAction={setAction}
        />)
      },
      topup: {
        title: "Top up Bot",
        component:(<TopUpForm 
          bot={selectedBot}
          onSubmit={handleTopUpBot}
          onCancel={() => onOpenChange(false)} 
        />)
      },
      withdraw: {
        title: "Withdraw from Bot",
        component:(<WithdrawForm
          bot={selectedBot}
          onSubmit={handleWithdrawBot}
          onCancel={() => onOpenChange(false)}
           />)
      }
    },
    strategies: {
      new: {
        title: "Create New Strategy",
        component: (<NewStrategyForm
              onSubmit={handleNewStrategy}
              onCancel={() => onOpenChange(false)}
              isFromBotForm={false}
              isEdit={false}
          />),
      },
      edit: {
        title: "Edit this Strategy",
        component: (<NewStrategyForm
              onSubmit={handleUpdateStartegy}
              onCancel={() => onOpenChange(false)}
              isFromBotForm={false}
              isEdit={true}
              data={selectedStrategy}
          />),
      },
      destructive: {
        title: "Delete this Strategy",
        component: (<MessageForm
              onSubmit={() => {
                handleDeleteStrategy(selectedStrategy)
                onOpenChange(false)
              }}
              onCancel={() => onOpenChange(false)}
              text="Are you sure you want to delete this strategy? This action cannot be undone."
              submitButtonText="Delete"
          />),
      }
    }
  }
  
  const formConfig = forms[mode]?.[action]

  if (!formConfig) return null

  const FormComponent = formConfig.component

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>{formConfig.title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto pr-2 -mr-2">
          {FormComponent}
        </div>
      </DialogContent>
    </Dialog>
  )
}
