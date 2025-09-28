import {useState} from "react"
import { format, subDays } from "date-fns"
import { CalendarRange, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

function getPresetRange(key) {
  const now = new Date()
  if (key === "7" || key === "30" || key === "90") {
    const days = parseInt(key, 10)
    const from = subDays(now, days - 1)
    return { from, to: now }
  }
  return undefined
}

export function PeriodSelector({ onChange, defaultValue = "7" }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState("list")   
  const [label, setLabel] = useState("Last 7 days")

  const [customRange, setCustomRange] = useState({ from: undefined, to: undefined })
  const [draftRange, setDraftRange] = useState({ from: undefined, to: undefined })
  const [hasCustom, setHasCustom] = useState(false)

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen)
    if (isOpen) {
      if (hasCustom) {
        setDraftRange(customRange)
        setView("calendar")
      } else {
        setView("list")
      }
    }
  }

  const applyPreset = (value) => {
    const preset = getPresetRange(value)
    if (!preset) return
    onChange?.(preset)
    if (value === "7") setLabel("Last 7 days")
    if (value === "30") setLabel("Last 30 days")
    if (value === "90") setLabel("Last 90 days")
    setHasCustom(false)
    setOpen(false)
  }

  const openCalendar = () => {
    setDraftRange(customRange?.from && customRange?.to ? customRange : { from: undefined, to: undefined })
    setView("calendar")
  }

  const handleDraftChange = (range) => {
    setDraftRange(range)
  }

  const handleCancel = () => {
  setView("list")
  }

  const handleApply = () => {
    if (!(draftRange?.from && draftRange?.to)) return
    setCustomRange(draftRange)
    setLabel(`${format(draftRange.from, "LLL dd, y")} – ${format(draftRange.to, "LLL dd, y")}`)
    onChange?.(draftRange)
    setHasCustom(true)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary" size="sm"
          className="justify-start text-left font-normal"
        >
          <CalendarRange className="h-4 w-4" />{label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={view === "list" ? "w-[200px] p-2" : "w-[300px] p-2"} align="end">
        {view === "list" ? (
          <div className="flex flex-col space-y-1">
            <Button variant="ghost" size="sm" className="justify-start" onClick={() => applyPreset("7")}>
              Last 7 days
            </Button>
            <Button variant="ghost" size="sm" className="justify-start" onClick={() => applyPreset("30")}>
              Last 30 days
            </Button>
            <Button variant="ghost" size="sm" className="justify-start" onClick={() => applyPreset("90")}>
              Last 90 days
            </Button>
            <Button variant="ghost" size="sm" className="justify-start" onClick={openCalendar}>
              Custom Date Range
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="justify-start w-fit" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <div className="text-xs opacity-70 pr-1">
                {draftRange?.from
                  ? draftRange?.to
                    ? `${format(draftRange.from, "LLL dd, y")} – ${format(draftRange.to, "LLL dd, y")}`
                    : `${format(draftRange.from, "LLL dd, y")} – …`
                  : "Pick a date range"}
              </div>
            </div>

            <Calendar
              className="w-full"
              initialFocus
              mode="range"
              captionLayout="dropdown"
              selected={draftRange}          
              onSelect={handleDraftChange} 
              disabled={(date) => date > new Date()}
            />

            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
              <Button
                onClick={handleApply} size="sm"
                disabled={!(draftRange?.from && draftRange?.to)}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
