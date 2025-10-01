import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Database,
  Cpu,
  Monitor,
  Shield,
  Layers,
  Zap,
  Check,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const layers = [
  {
    badge: "DATA",
    icon: Database,
    title: "Data & Analytics",
    description: "Ingest, enrich, and store market data for low‑latency insights.",
    features: [
      "On-chain data via The Graph",
      "Technical indicators (EMA, RSI)",
      "Real-time signal engine", 
      "TimescaleDB time series storage",
    ],
  },
  {
    badge: "AI",
    icon: Cpu,
    title: "AI Decision Engine",
    description: "ML models turn signals into risk‑aware trading decisions.",
    features: [
      "Price forecasting & scoring",
      "Risk management gates", 
      "Portfolio optimization",
      "Real‑time validation",
    ],
  },
  {
    badge: "EXEC",
    icon: Monitor,
    title: "Execution & Interface",
    description: "Secure execution across L2s with live monitoring.",
    features: [
      "Audited smart contracts",
      "Multi‑L2 (Arbitrum, Base, Optimism)",
      "MEV‑aware execution",
      "Live dashboard & reporting",
    ],
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Architecture() {
  return (
    <section id="architecture" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header / value prop */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Built for Performance.
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Three specialized layers working in harmony - trade smarter, not harder
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <Button size="lg" className="gap-2">
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
        </motion.div>

        {/* Layers grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {layers.map(({ badge, icon: Icon, title, description, features }, idx) => (
            <motion.div
              key={title}
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.1 * idx }}
              className="h-full"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/10">
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Header with icon and badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {badge}
                    </Badge>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                    {description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-3 flex-1">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Footer note */}
                  <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
                    Layer {idx + 1} of 3
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="show"
          className="text-center text-sm text-muted-foreground mt-12"
        >
          Free 14-day trial. No credit card required. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
}