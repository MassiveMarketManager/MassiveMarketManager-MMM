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

import { useNavigate } from "react-router-dom"

export default function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailNorm = (email || '').trim()
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailNorm || !emailRe.test(emailNorm)) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address.",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        position: "top-center",
      })
      return
    }

    if (password1 !== password2) {
      toast.error("Passwords do not match", {
        description: "Please make sure both passwords are the same.",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        position: "top-center",
      })
      return;
    }

    if (password1.length < 8 || password2.length < 8) {
      toast.error("Password is too short", {
        description: "Password must be at least 8 characters long.",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        position: "top-center",
      })
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://massivemarketmanager.de/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailNorm,
          password: password1,
        }),
      });

      const isJson = res.headers.get("content-type")?.includes("application/json");
      const payload = isJson ? await res.json() : await res.text();

      if (!res.ok) {
        console.log("Error payload:", payload);
        let msg = typeof payload === "string" ? payload : "";
        if (!msg && payload && typeof payload === "object") {
          if (payload.detail) msg = payload.detail;
          else if (payload.message) msg = payload.message;
          else if (Array.isArray(payload.errors) && payload.errors.length) {
            msg = payload.errors
              .map(e => e.defaultMessage || e.message || `${e.field || "field"} invalid`)
              .slice(0, 2)
              .join("; ");
          }
        }
        throw new Error(msg || `HTTP ${res.status}`);
      }

      navigate(`/auth/check-email?email=${encodeURIComponent(emailNorm)}`)

    } catch (err) {
      toast.error("Registration failed", {
        description: err?.message || "Unexpected error",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        position: "top-center",
      })
    } finally {
      setLoading(false);
    }
  };

  const isValid = email && password1 && password2 && password1 === password2



  return (
    <div className={cn("flex flex-col gap-6")}>
      <Toaster />
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to MMM! </CardTitle>
          <CardDescription>
            Enter your email and password to create your account
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
                  type={showPassword1 ? "text" : "password"}
                  required
                  placeholder="password"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  className={
                    password2 && password1 !== password2
                      ? "border-red-500"
                      : ""
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword1(!showPassword1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword1 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Must be at least 8 characters long.
              </p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword2 ? "text" : "password"}
                  required
                  placeholder="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className={
                    password2 && password1 !== password2
                      ? "border-red-500"
                      : ""
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword2 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || loading}
              style={{ backgroundColor: "var(--us-color-green)" }}
            >
              {loading ? <><Loader2Icon className="animate-spin" /> Creating account...</> : "Sign Up"}
            </Button>
            <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/auth/sign-in" className="underline underline-offset-4">
                  Login
                </a>
              </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
