import { Hero } from "../components/landing/Hero"
import { Features } from "../components/landing/Features" 
import { TechStack } from "../components/landing/TechStack"
import { QuickStart } from "../components/landing/QuickStart"
import { Header } from "../components/landing/Header"
import { Architecture } from "../components/landing/Architecture"
import { Roadmap } from "../components/landing/Roadmap"

import { Terminal, Github, Twitter, Mail, ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      
      <main>
        <section id="hero">
          <Hero />
        </section>
        
        <section id="architecture">
          <Architecture />
        </section>
        
        <section id="features">
          <Features />
        </section>
        
        <section id="tech">
          <TechStack />
        </section>
        
        <section id="start">
          <QuickStart />
        </section>
        
        <section id="roadmap">
          <Roadmap />
        </section>

      </main>
      
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 rounded-full w-12 h-12 shadow-lg backdrop-blur-sm"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
      
      {/* Enhanced Footer */}
      <footer className="border-t bg-muted/20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-6 md:grid-cols-2 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <Terminal className="h-7 w-7 text-primary" />
                  <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    MMM
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Advanced AI-driven trading system for decentralized finance. 
                Empowering traders with cutting-edge technology.
              </p>
              <div className="flex gap-4 mt-6">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Product</h4>
              <div className="space-y-4 text-muted-foreground">
                <a href="#features" className="block hover:text-primary transition-colors">Features</a>
                <a href="#tech" className="block hover:text-primary transition-colors">Technology</a>
                <a href="#architecture" className="block hover:text-primary transition-colors">Architecture</a>
                <a href="#roadmap" className="block hover:text-primary transition-colors">Roadmap</a>
              </div>
            </div>
            
            {/* Developers */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Developers</h4>
              <div className="space-y-4 text-muted-foreground">
                <a href="#start" className="block hover:text-primary transition-colors">Quick Start</a>
                <a href="#" className="block hover:text-primary transition-colors">Documentation</a>
                <a href="#" className="block hover:text-primary transition-colors">API Reference</a>
                <a href="#" className="block hover:text-primary transition-colors">GitHub</a>
              </div>
            </div>
            
            {/* Company
            <div>
              <h4 className="font-semibold text-lg mb-6">Company</h4>
              <div className="space-y-4 text-muted-foreground">
                <a href="#team" className="block hover:text-primary transition-colors">Team</a>
                <a href="#" className="block hover:text-primary transition-colors">Careers</a>
                <a href="#" className="block hover:text-primary transition-colors">Contact</a>
                <a href="#" className="block hover:text-primary transition-colors">Partners</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6">Legal</h4>
              <div className="space-y-4 text-muted-foreground">
                <a href="#" className="block hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="block hover:text-primary transition-colors">Terms of Service</a>
                <a href="#" className="block hover:text-primary transition-colors">Cookie Policy</a>
                <a href="#" className="block hover:text-primary transition-colors">Compliance</a>
              </div>
            </div>
            */}
          </div>
          
          {/* Bottom Bar */}
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              <p>© 2025 MassiveMarketManager. All rights reserved.</p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span>Built with ❤️ for the DeFi community</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}