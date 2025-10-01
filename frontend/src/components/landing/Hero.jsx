import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Shield, Zap, BarChart3 } from "lucide-react"

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-6xl mx-auto px-4 py-20">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted px-4 py-2 rounded-full border">
            <span className="text-sm font-medium">AI-Driven DeFi Trading Platform</span>
          </div>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          MassiveMarket
          <span className="text-primary">Manager</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Advanced AI trading system for decentralized finance. Machine learning models 
          and audited smart contracts for automated spot trading on leading L2 networks.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="gap-2 h-12 px-8">
            Launch App <ArrowRight size={20} />
          </Button>
          <Button size="lg" variant="outline" className="gap-2 h-12 px-8">
            <Brain size={20} />
            Read Docs
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          {[
            { icon: <Brain className="w-5 h-5" />, value: "AI/ML", label: "Powered" },
            { icon: <Shield className="w-5 h-5" />, value: "Audited", label: "Contracts" },
            { icon: <Zap className="w-5 h-5" />, value: "L2", label: "Networks" },
            { icon: <BarChart3 className="w-5 h-5" />, value: "24/7", label: "Trading" }
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-lg border bg-card">
              <div className="flex justify-center mb-2 text-primary">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}