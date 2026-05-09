//import { SignUpForm } from "../components/signup/SignUpForm"
import { Outlet  } from "react-router-dom"
import { ThemeToggle } from "../components/theme-toggle"

export default function Auth() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="absolute top-5 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}