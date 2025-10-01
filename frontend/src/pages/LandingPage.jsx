import { Hero } from "../components/landing/Hero"
import { Features } from "../components/landing/Features" 
import { TechStack } from "../components/landing/TechStack"
import { QuickStart } from "../components/landing/QuickStart"
import { Team } from "../components/landing/Team"
import { Header } from "../components/Header"
import { Architecture } from "../components/landing/Architecture"
import { Roadmap } from "../components/landing/Roadmap"

import { Menu, Terminal } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Architecture />
      <Features />
      <TechStack /> 
      <QuickStart />
      <Roadmap />
      <Team />
      
      {/* Enhanced Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="h-6 w-6" />
                <span className="font-bold text-lg">MMM</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Advanced AI-driven trading system for decentralized finance.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#features" className="block hover:text-primary">Features</a>
                <a href="#tech" className="block hover:text-primary">Technology</a>
                <a href="#roadmap" className="block hover:text-primary">Roadmap</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Developers</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#start" className="block hover:text-primary">Quick Start</a>
                <a href="#" className="block hover:text-primary">Documentation</a>
                <a href="#" className="block hover:text-primary">GitHub</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#team" className="block hover:text-primary">Team</a>
                <a href="#" className="block hover:text-primary">Contact</a>
                <a href="#" className="block hover:text-primary">Privacy</a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 MassiveMarketManager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}