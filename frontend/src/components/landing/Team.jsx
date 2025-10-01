import { Card, CardContent } from "@/components/ui/card"

export function Team() {
  const team = [
    {
      name: "Artem Zagorskyi",
      roles: ["Smart Contracts", "ML/AI Engineering"],
      focus: "Solidity, Ethers.js/Hardhat, market data modeling, training pipelines"
    },
    {
      name: "Nikolai Milenko", 
      roles: ["Backend Development", "Smart Contracts"],
      focus: "Spring Boot, API, persistence, Solidity, Hardhat"
    }
  ]

  return (
    <section id="team" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Team</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, i) => (
            <Card key={i} className="text-center">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {member.roles.map((role, j) => (
                    <span key={j} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {role}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{member.focus}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}