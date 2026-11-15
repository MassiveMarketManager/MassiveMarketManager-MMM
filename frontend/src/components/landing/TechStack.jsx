import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@iconify/react"

const technologies = [
  { icon: "simple-icons:springboot", name: "Spring Boot 4" },
  { icon: "logos:python",            name: "Python ML" },
  { icon: "simple-icons:timescale",  name: "TimescaleDB" },
  { icon: "logos:docker-icon",       name: "Docker" },
  { icon: "logos:react",             name: "React" },
  { icon: "simple-icons:solidity",   name: "Solidity" },
  { icon: "simple-icons:optimism",   name: "L2 Networks"},
  { icon: "simple-icons:vault", name: "HashiCorp Vault" }
]

export function TechStack() {
  return (
    <section id="tech" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Technology</Badge>
          <h2 className="text-3xl font-bold mb-4">Powered By Modern Stack</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Cutting-edge technologies for reliable DeFi trading
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
          }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech.name}
              variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-xl border bg-background flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                {tech.icon && (
                  <Icon icon={tech.icon} width="40" height="40" />
                )}
              </div>
              <span className="text-sm font-medium leading-tight">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Monitored 24/7 • TypeSafe development
          </p>
        </motion.div>
      </div>
    </section>
  )
}