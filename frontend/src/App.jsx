//import { Button } from "@/components/ui/button"
import { Routes, Route, Navigate } from "react-router-dom"
import Signin from "./pages/Signin.jsx"
import SignUp from "./pages/SignUp.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import CheckEmailPage from './pages/CheckEmailPage.jsx'
import VerifyEmailPage from './pages/VerifyEmailPage'
import DashboardOverview from "@/components/dashboard/overview/dashboard-overview.jsx"
import DashboardBots from "@/components/dashboard/bots/dashboard-bots"
import LandingPage from "./pages/LandingPage.jsx"


function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/sign-in" element={<Signin />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path='/auth/check-email' element={<CheckEmailPage />} />
        <Route path='/auth/verify' element={<VerifyEmailPage />} />
        <Route path="/dashboard" element={<Dashboard />} >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="analytics" element={<></>} />
          <Route path="bots" element={<DashboardBots/>} />
        </Route>
      </Routes>
  )
}

export default App