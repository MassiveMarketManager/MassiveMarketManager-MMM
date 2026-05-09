import { cn } from "@/lib/utils"
import { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent,CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { useLocation } from 'react-router-dom'
import { Mail, Loader2Icon } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { CheckCircle2, XCircle } from "lucide-react"

import { toast } from "sonner"
import { apiClient } from "@/lib/apiClient"

export default function CheckEmailForm() {
  const { search } = useLocation()
  const email = useMemo(() => new URLSearchParams(search).get('email') || '', [search])
  const [loading, setLoading] = useState(false)
  //const [msg, setMsg] = useState(null)

  

  const resend = async () => {
    setLoading(true)
    try {
      await apiClient.post('/api/auth/resend-verification', { email }, { auth: false })
      makeToast("Verification email sent again", "success")
    } catch (e) {
      makeToast(e.message || "Failed to resend", "error")
    } finally {
      setLoading(false)
    }
  }

  const makeToast = (message, status) => {
    if (status === "error") {
      toast.error(message, {
        description: "Please try again",
        duration: 5000,
        position: "top-center",
        icon: <XCircle className="h-5 w-5 text-red-500" />
      })
    } else {
      toast.success(message, {
        description: "Check your inbox",
        duration: 3000,
        position: "top-center",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
      })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      
        <Toaster />
          <Card>
            <div className="flex justify-center my-2">
              <div className="bg-green-100 rounded-full p-4">
                <Mail className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <CardHeader className="items-center text-center">
              <CardTitle className="text-xl pb-3">Confirm your email address</CardTitle>
              <CardDescription className="text-md flex flex-col">
                <>We sent a verification link to </>
                <span className="text-md font-bold pt-2">{email}</span>
              </CardDescription>
            </CardHeader>
              <CardContent className="items-center text-center">
                <p className="text-md text-muted-foreground">
                  Check your email and click on the <br/>confirmation link to continue.
                </p>
              </CardContent>

              <CardFooter className="flex flex-col justify-center pt-10">
                <Button 
                  onClick={resend} 
                  disabled={loading || !email} 
                  variant="outline" 
                  className="text-green-600"
                >
                  {loading ? <><Loader2Icon className="animate-spin" /> Sending...</> : 'Resend email'}
                </Button>
              </CardFooter>

          </Card>
    </div>
    
  )
}
