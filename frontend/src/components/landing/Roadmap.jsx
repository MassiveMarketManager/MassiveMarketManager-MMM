import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle, Clock } from "lucide-react"

export function Roadmap() {
  const phases = [
    {
      phase: "Phase 1",
      title: "Core Infrastructure",
      status: "completed",
      items: [
        "Database schema & architecture",
        "Docker containerization", 
        "Basic REST API endpoints",
        "Project setup & CI/CD"
      ]
    },
    {
      phase: "Phase 2", 
      title: "Data & Analytics",
      status: "current",
      items: [
        "Market data ingestion pipeline",
        "Technical indicators calculation",
        "The Graph integration",
        "Data validation & testing"
      ]
    },
    {
      phase: "Phase 3",
      title: "ML/AI Integration", 
      status: "upcoming",
      items: [
        "Machine learning model research",
        "Training pipeline development",
        "Model deployment & testing",
        "Performance optimization"
      ]
    },
    {
      phase: "Phase 4",
      title: "Trading Execution",
      status: "upcoming", 
      items: [
        "Smart contract development",
        "Uniswap V3 integration",
        "Risk management system",
        "Multi-L2 deployment"
      ]
    },
    {
      phase: "Phase 5",
      title: "Dashboard & UX",
      status: "upcoming",
      items: [
        "React dashboard development", 
        "Real-time monitoring",
        "Strategy configuration",
        "Performance analytics"
      ]
    },
    {
      phase: "Phase 6",
      title: "Security & Scaling",
      status: "upcoming",
      items: [
        "Smart contract audits",
        "Security testing",
        "Performance optimization",
        "Production deployment"
      ]
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
      case "current": return <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
      default: return <Circle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": 
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50"
      case "current": 
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50"
      default: 
        return "border-muted bg-muted/50"
    }
  }

  return (
    <section id="roadmap" className="py-20 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Development Roadmap</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our strategic development phases for building a robust trading platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {phases.map((phase, index) => (
            <Card key={index} className={`border-2 ${getStatusColor(phase.status)}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(phase.status)}
                  <div>
                    <div className="text-sm font-mono text-muted-foreground">{phase.phase}</div>
                    <h3 className="font-semibold">{phase.title}</h3>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}