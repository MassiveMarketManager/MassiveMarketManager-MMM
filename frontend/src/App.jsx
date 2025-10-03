//import { Button } from "@/components/ui/button"
import { Routes, Route, Navigate } from "react-router-dom"
import SigninForm from "@/components/auth/SigninForm.jsx"
import SignUpForm from "@/components/auth/SignUpForm.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import CheckEmailForm from '@/components/auth/CheckEmailForm.jsx'
import VerifyEmailForm from '@/components/auth/VerifyEmailForm.jsx'
import DashboardOverview from "@/components/dashboard/overview/dashboard-overview.jsx"
import DashboardBots from "@/components/dashboard/bots/dashboard-bots"
import LandingPage from "./pages/LandingPage.jsx"
import Auth from "./pages/Auth.jsx"
import NotFoundPage from "./pages/NotFoundPage.jsx"


function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} >
          <Route index element={<Navigate to="sign-up" replace />} />
          <Route path="sign-in" element={<SigninForm />} />
          <Route path="sign-up" element={<SignUpForm />} />
          <Route path='check-email' element={<CheckEmailForm />} />
          <Route path='verify' element={<VerifyEmailForm />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="analytics" element={<></>} />
          <Route path="bots" element={<DashboardBots/>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  )
}

export default App