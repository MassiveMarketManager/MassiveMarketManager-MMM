import { useState } from "react"
import { Label } from "@/components/ui/label"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardSettings() {
    const [openGeneral, setOpenGeneral] = useState(true)
    const [openAccount, setOpenAccount] = useState(false)
    const [openSecurity, setOpenSecurity] = useState(false)

    return (
        <div className="px-4 space-y-4 lg:px-6">

          <Collapsible open={openGeneral} onOpenChange={setOpenGeneral}>
              <div className="rounded-xl border bg-white shadow-sm transition-all">
                <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-lg font-medium hover:bg-gray-50 rounded-t-xl">
                  <span>General</span>
                  {openGeneral ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </CollapsibleTrigger>
                <CollapsibleContent className="border-t px-5 py-4 space-y-4">
                    Something...
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* ACCOUNT SETTINGS */}
            <Collapsible open={openAccount} onOpenChange={setOpenAccount}>
              <div className="rounded-xl border bg-white shadow-sm transition-all">
                <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-lg font-medium hover:bg-gray-50 rounded-t-xl">
                  <span>Account</span>
                  {openAccount ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </CollapsibleTrigger>
                <CollapsibleContent className="border-t px-5 py-4 space-y-4">
                  Something...
                </CollapsibleContent>
              </div>
            </Collapsible>

            <Collapsible open={openSecurity} onOpenChange={setOpenSecurity}>
              <div className="rounded-xl border border-red-500 bg-white shadow-sm transition-all">
                <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-lg font-medium hover:bg-gray-50 rounded-t-xl">
                  <span>Delete Account</span>
                  {openSecurity ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </CollapsibleTrigger>
                <CollapsibleContent className="border-t px-5 py-4 space-y-4">
                  <Label>Once you delete your account, there is no going back. Please be certain.</Label>
                  <Button variant="destructive" className="mt-2">
                    Delete account
                  </Button>
                </CollapsibleContent>
              </div>
            </Collapsible>
        </div>
    );
}