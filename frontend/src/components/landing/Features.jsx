import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Shield, Zap, BarChart3, Monitor, Lock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { OrbitingEllipses } from "@/components/animations/orbiting-ellipses"

const items = [
  { icon: Brain,    title: "Predictive Signals", desc: "AI-powered entries/exits—less noise, more clarity." },
  { icon: Shield,   title: "Risk Guardrails",    desc: "Risk limits and stop logic to reduce drawdowns." },
  { icon: Zap,      title: "MEV-Aware Execution",desc: "Execution aware of MEV and latency to protect edge." },
  { icon: BarChart3,title: "Live Analytics",     desc: "Real-time metrics, indicators, and a unified signal feed." },
  { icon: Monitor,  title: "Unified Dashboard",  desc: "Positions, PnL, history, and alerts in one place." },
  { icon: Lock,     title: "Secure by Design",   desc: "Keys and contracts with security and control first." },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

function FeatureCard({ Icon, title, desc, className = "" }) {
  return (
    <Card className={`group h-full transition-all duration-300 hover:shadow-xl ${className}`}>
      <CardContent className="p-6 h-full flex flex-col">
        <div className="mb-4">
          <div className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-105" aria-hidden="true" />
            <span className="absolute inset-0 rounded-xl ring-1 ring-primary/10 group-hover:ring-primary/20 transition" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  )
}

export function Features() {
  const [activeFeature, setActiveFeature] = useState(null)
  const [isAnimationPaused, setIsAnimationPaused] = useState(false)
  const radiusX = 380
  const radiusY = 200

  const handleIconHover = (feature) => {
    setActiveFeature(feature)
    setIsAnimationPaused(true)
  }

  const handleIconLeave = () => {
    setIsAnimationPaused(false)
  }

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <Badge variant="secondary" className="mb-3">Benefits</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Core Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Less tech noise—more outcomes: clear signals, risk control, clean analytics.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button asChild size="lg" className="group"><a href="#pricing">Start free trial</a></Button>
            <Button asChild variant="ghost" size="lg"><a href="#pricing">See pricing</a></Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Free 14-day trial. No credit card required. Cancel anytime.</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto"
        >
          {items.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={item}>
              <FeatureCard Icon={Icon} title={title} desc={desc} />
            </motion.div>
          ))}
        </motion.div>

        <div className="relative hidden md:block mx-auto max-w-6xl">
          <div className="relative mx-auto h-[350px] lg:h-[550px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(80%,300px)] z-10"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature?.title || items[0].title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.38 }}
                >
                  <FeatureCard
                    Icon={activeFeature?.icon || items[0].icon}
                    title={activeFeature?.title || items[0].title}
                    desc={activeFeature?.desc || items[0].desc}
                    className="bg-gradient-to-br from-background to-muted/50 border-2 border-primary/20"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                width: `${radiusX * 2}px`,
                height: `${radiusY * 2}px`,
              }}
            >
              <OrbitingEllipses 
                radiusX={radiusX}
                radiusY={radiusY}
                iconSize={56} 
                speed={0.4} 
                path
                paused={isAnimationPaused}
              >
                {items.map(({ icon: Icon, title }) => (
                  <motion.div 
                    key={title}
                    className="grid place-items-center rounded-full border bg-background/80 backdrop-blur-sm size-[56px] cursor-pointer hover:scale-110 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                    onMouseEnter={() => handleIconHover(items.find(item => item.title === title))}
                    onMouseLeave={handleIconLeave}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                    <span className="sr-only">{title}</span>
                  </motion.div>
                ))}
              </OrbitingEllipses>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border">
                Hover over the icons to learn more
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}