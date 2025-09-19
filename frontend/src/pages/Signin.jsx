import { SigninForm } from "../components/signin/SigninForm"

export default function Signin() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <SigninForm />
      </div>
    </div>
  )
}