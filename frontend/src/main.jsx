import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom"
import ReactDOM from "react-dom/client"
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "@/components/theme-provider"

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
