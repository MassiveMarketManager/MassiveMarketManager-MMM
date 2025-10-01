import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Shield, Zap, BarChart3, Monitor, Lock } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  {
    icon: Brain,
    title: "Predictive Signals",
    desc: "AI-powered entries/exits—less noise, more clarity."
  },
  {
    icon: Shield,
    title: "Risk Guardrails",
    desc: "Risk limits and stop logic to reduce drawdowns."
  },
  {
    icon: Zap,
    title: "MEV-Aware Execution",
    desc: "Execution aware of MEV and latency to protect edge."
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    desc: "Real-time metrics, indicators, and a unified signal feed."
  },
  {
    icon: Monitor,
    title: "Unified Dashboard",
    desc: "Positions, PnL, history, and alerts in one place."
  },
  {
    icon: Lock,
    title: "Secure by Design",
    desc: "Keys and contracts with security and control first."
  }
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

export function Features() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">Benefits</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Core Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Less tech noise—more outcomes: clear signals, risk control, clean analytics.
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <Button asChild size="lg" className="group">
              <a href="#pricing" aria-label="Start free trial">
                Start free trial
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="#pricing" aria-label="See pricing">See pricing</a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Free 14-day trial. No credit card required. Cancel anytime.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {items.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={item}>
              <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="mb-4">
                    <div className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-105" aria-hidden="true" />
                      <span className="absolute inset-0 rounded-xl ring-1 ring-primary/10 group-hover:ring-primary/20 transition" />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {desc}
                  </p>

                  <div className="mt-auto pt-5 text-xs text-muted-foreground">
                    Designed for results, not noise.
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
