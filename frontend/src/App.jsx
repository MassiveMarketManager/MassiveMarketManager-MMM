//import { Button } from "@/components/ui/button"
import { Routes, Route, Navigate } from "react-router-dom"
import Signin from "./pages/Signin.jsx"
import SignUp from "./pages/SignUp.jsx"
import Dashboard from "./pages/Dashboard"
import DashboardOverview from "@/components/dashboard/overview/dashboard-overview.jsx"
import BotsDataTable from "@/components/dashboard/bots/bots-data-table"


function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/auth/sign-in" />} />
        <Route path="/auth/sign-in" element={<Signin />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} >
          <Route index element={<DashboardOverview />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="analytics" element={<></>} />
          <Route path="bots" element={<BotsDataTable/>} />
        </Route>
      </Routes>
  )
}

export default App