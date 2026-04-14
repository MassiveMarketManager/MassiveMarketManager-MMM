import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader2Icon, Eye, EyeOff, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function SigninForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email.trim(), password)

      // Redirect to the page the user was trying to reach, or /dashboard
      const redirectTo = location.state?.from?.pathname || "/dashboard"
      navigate(redirectTo, { replace: true })
    } catch (err) {
      toast.error("Login failed", {
        description: err?.message || "Invalid email or password",
        position: "top-center",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      })
    } finally {
      setLoading(false)
    }
  }

  const isValid = email && password


  return (
    <div className={cn("flex flex-col gap-6")}>
      <Toaster />
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back, dude! </CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="password"
                  value={password}
                  className="pr-10"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || loading}
              style={{ backgroundColor: "var(--us-color-green)" }}
            >
              {loading ? <><Loader2Icon className="animate-spin" /> Loggin in...</> : <>Login</>}
            </Button>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/auth/sign-up" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
