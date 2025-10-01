import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Terminal, Database } from "lucide-react"

export function QuickStart() {
  return (
    <section id="start" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Get Started in Minutes</h2>
        </div>

        <Tabs defaultValue="docker" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="docker" className="gap-2">
              <Terminal className="w-4 h-4" />
              Docker Setup
            </TabsTrigger>
            <TabsTrigger value="env" className="gap-2">
              <Code className="w-4 h-4" />
              Environment
            </TabsTrigger>
            <TabsTrigger value="access" className="gap-2">
              <Database className="w-4 h-4" />
              Access Points
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="docker" className="space-y-4">
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
              <code>{`# Clone and setup
git clone https://github.com/your-org/mmm
cd mmm

# Start services
docker compose up -d --build

# Monitor logs
docker compose logs -f`}</code>
            </pre>
          </TabsContent>

          <TabsContent value="env">
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
              <code>{`# .env file
POSTGRES_USER=mmm
POSTGRES_PASSWORD=mmm_password
POSTGRES_DB=mmm
APP_PORT=8080
FRONTEND_PORT=3000
SPRING_PROFILES_ACTIVE=dev`}</code>
            </pre>
          </TabsContent>

          <TabsContent value="access">
            <div className="grid gap-4 text-center">
              {[
                { name: "API", url: "http://localhost:8080", desc: "Backend REST API" },
                { name: "Dashboard", url: "http://localhost:3000", desc: "React Frontend" },
                { name: "Database", url: "localhost:5432", desc: "PostgreSQL + TimescaleDB" }
              ].map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">{item.name}</h4>
                    <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {item.url}
                    </code>
                    <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}