import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Terminal } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Technology", href: "#tech" },
    { name: "Quick Start", href: "#start" },
    { name: "Team", href: "#team" },
    { name: "Roadmap", href: "#roadmap" }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center">
        <div className="flex items-center gap-2 mr-8">
          <Terminal className="h-6 w-6" />
          <span className="font-bold text-xl">MMM</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            Sign In
          </Button>
          <Button size="sm">
            Get Started
          </Button>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="flex flex-col gap-2 mt-4">
                  <Button variant="outline">Sign In</Button>
                  <Button>Get Started</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}