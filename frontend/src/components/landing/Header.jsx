import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Terminal, Rocket, LogIn, Sun, Moon } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  //const { theme, setTheme } = useTheme()

  const navItems = [
    { name: "Features", href: "features" },
    { name: "Technology", href: "tech" },
    { name: "Quick Start", href: "start" },
    { name: "Roadmap", href: "roadmap" }
  ]

  const handleAuthNavigation = (path) => {
    navigate(path)
    setIsOpen(false)
  }


  const smoothScrollTo = (hash, e) => {
    e.preventDefault()
    
    if (window.location.pathname !== "/") {
      navigate(`/#${hash}`)
      setIsOpen(false)
      return
    }

    const element = document.getElementById(hash)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      window.history.pushState(null, null, `/#${hash}`)
    }
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-10">
          <Terminal className="h-7 w-7 text-primary" />
          <span className="font-bold text-2xl tracking-tight">MMM</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={(e) => smoothScrollTo(item.href, e)}
              className="text-base font-medium transition-colors hover:text-primary text-foreground/80 hover:text-foreground"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Desktop Theme Toggle Switch */}
          <ThemeToggle/>

          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden sm:flex gap-2 text-base font-medium"
            onClick={() => navigate("/auth/sign-in")}
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
          <Button 
            size="sm" 
            className="gap-2 text-base font-medium px-6"
            onClick={() => navigate("/auth/sign-up")}
          >
            <Rocket className="h-4 w-4" />
            Get Started
          </Button>

          {/* Mobile Navigation Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-md">
              {/* Mobile Logo in Sheet */}
              <Link 
                to="/" 
                className="flex items-center gap-2 pb-6 border-b"
                onClick={() => setIsOpen(false)}
              >
                <Terminal className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">MMM</span>
              </Link>
              
              {/* Mobile Navigation Items */}
              <div className="flex flex-col gap-1 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={(e) => smoothScrollTo(item.href, e)}
                    className="text-lg font-medium py-3 px-4 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground text-left"
                  >
                    {item.name}
                  </button>
                ))}
                
                {/* Mobile Theme Toggle */}
                <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-accent transition-colors">
                  <span className="text-lg font-medium">Theme</span>
                  <ThemeToggle/>
                </div>
              </div>
              
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3 mt-8 pt-6 border-t">
                <Button 
                  variant="outline" 
                  className="justify-center gap-2 text-base py-3 h-auto"
                  onClick={() => handleAuthNavigation("/auth/sign-in")}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
                <Button 
                  className="justify-center gap-2 text-base py-3 h-auto"
                  onClick={() => handleAuthNavigation("/auth/sign-up")}
                >
                  <Rocket className="h-4 w-4" />
                  Get Started
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}