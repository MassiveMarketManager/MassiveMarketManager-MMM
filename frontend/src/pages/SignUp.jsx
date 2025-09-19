import { SignUpForm } from "../components/signup/SignUpForm"

export default function SignUp() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}