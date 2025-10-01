import { Card, CardContent } from "@/components/ui/card"

export function TechStack() {
  const stack = [
    {
      category: "Backend & AI Core",
      items: ["Java 21", "Spring Boot 4", "Python ML", "PostgreSQL + TimescaleDB", "Docker"]
    },
    {
      category: "Frontend & UX", 
      items: ["React", "JavaScript", "Vite", "Tailwind CSS", "shadcn/ui"]
    },
    {
      category: "Blockchain & Smart Contracts",
      items: ["Solidity", "Hardhat", "Ethers.js", "Uniswap V3", "L2 Networks"]
    }
  ]

  return (
    <section id="tech" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Technology Stack</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Enterprise-grade technologies for reliable DeFi trading
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stack.map((category, i) => (
            <div key={i} className="text-center">
              <h3 className="text-xl font-semibold mb-6 text-blue-600">{category.category}</h3>
              <div className="space-y-3">
                {category.items.map((tech, j) => (
                  <div key={j} className="bg-gray-100 dark:bg-gray-800 py-3 px-4 rounded-lg">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}