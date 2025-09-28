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
import { Loader2Icon } from "lucide-react"
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { Eye, EyeOff } from "lucide-react"

export function SignUpForm({ className, ...props }) {
  const [email, setEmail] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password1 !== password2) {
      setError({
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same.",
      })
      return
    }

    if (password1.length < 8  || password2.length < 8 ) {
      setError({
        title: "Password is too short",
        description: "Please make sure both passwords are at least 8 characters long.",
      })
      return
    }

    setLoading(true)
    try {
      // 🔧 Пример запроса на backend (можно заменить на твой API)
      const res = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: password1, confirmPassword: password2 }),
      })

      if (!res.ok) {
        throw new Error("Invalid email or password")
      }

      const data = await res.json()
      console.log("✅ Signned up:", data)

      // тут можно сохранить токен в localStorage или context
      localStorage.setItem("token", data.token)

    } catch (err) {
      setError({
        title: "Registration failed",
        description: err.message,
      })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to MMM! </CardTitle>
          <CardDescription>
            Enter your email and password to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <Alert variant="destructive" >
                <Terminal className="h-4 w-4" />
                <AlertTitle>{error.title}</AlertTitle>
                <AlertDescription>{error.description}</AlertDescription>
              </Alert>
            )}
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
              disabled={loading}
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
