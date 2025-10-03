import { cn } from "@/lib/utils"
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate  } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Toaster } from "@/components/ui/sonner"
import { CheckCircle2, XCircle } from "lucide-react"
import { PartyPopper,Loader2Icon } from "lucide-react"
import { Button } from '@/components/ui/button'

import { toast } from "sonner"

export default function VerifyEmailForm() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const token = useMemo(() => new URLSearchParams(search).get('token') || '', [search])
  const [state, setState] = useState({ loading: true, ok: false })

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setState({ loading: false, ok: false })
        toast.error("Missing token", {
          description: "Verification link is invalid.",
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          position: "top-center",
        })
        return
      }
      try {
        let res = await fetch('http://localhost:8080/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        // запасной: если бэк ждёт query param
        if (!res.ok && res.status === 400) {
          res = await fetch(`http://localhost:8080/api/auth/verify?token=${encodeURIComponent(token)}`, { method: 'POST' })
        }

        const isJson = res.headers.get('content-type')?.includes('application/json')
        const payload = isJson ? await res.json() : await res.text()

        if (!res.ok) {
          const msg = typeof payload === 'string' ? payload : payload?.detail || payload?.message || `HTTP ${res.status}`
          throw new Error(msg)
        }

        setState({ loading: false, ok: true })
        toast.success("Email verified!", {
          description: "You can sign in now.",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          position: "top-center",
        })
      } catch (e) {
        setState({ loading: false, ok: false })
        toast.error("Verification failed", {
          description: e.message || "Please try again later.",
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          position: "top-center",
        })
      }
    }
    run()
  }, [token])

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Toaster />
      <Card >
        <div className="flex justify-center my-2">
          <div
            className={`rounded-full p-4 ${
              state.loading
                ? "bg-blue-100"
                : state.ok
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            {state.loading ? (
              <Loader2Icon className="h-8 w-8 text-blue-500 animate-spin" />
            ) : state.ok ? (
              <PartyPopper className="h-8 w-8 text-green-500" />
            ) : (
              <XCircle className="h-8 w-8 text-red-500" />
            )}
          </div>
        </div>
      <CardHeader className="items-center text-center">
        <CardTitle className="text-xl">{state.loading ? 
            <>Verifying...</>
           : state.ok ? <>Your Account Is Ready!</> : <>Something went wrong</>}
        </CardTitle>
        <CardDescription className="text-md">{state.loading ? <>Please wait till confirmation ends.</> : state.ok ? <>You can start trading</> : <>Email confirmation failed, try later.</>}</CardDescription>
      </CardHeader>
      {state.ok && (
          <CardFooter className="flex justify-center pt-10">
            <Button
              onClick={() => navigate("/auth/sign-in")}
              variant="outline"
              className="text-green-600"
            >
              Go to Sign In
            </Button>
          </CardFooter>
        )}
    </Card>
    </div>
    
  )
}
