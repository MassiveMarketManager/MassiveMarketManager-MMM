//import { SignUpForm } from "../components/signup/SignUpForm"
import { Outlet  } from "react-router-dom"

export default function Auth() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}