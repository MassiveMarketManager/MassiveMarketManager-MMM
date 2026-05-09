import React from "react"
import { cn } from "@/lib/utils"

export function OrbitingEllipses({
  className,
  children,
  reverse,
  duration = 20,
  radiusX = 160,
  radiusY = 120,
  path = true,
  iconSize = 30,
  speed = 1,
  paused = false,
  ...props
}) {
  const calculatedDuration = duration / speed
  const kids = React.Children.toArray(children)
  const n = kids.length || 1

  return (
    <div className="relative size-full">
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <ellipse
            className="stroke-black/10 stroke-1 dark:stroke-white/10"
            cx="50%"
            cy="50%"
            rx={radiusX}
            ry={radiusY}
            fill="none"
          />
        </svg>
      )}

      {kids.map((child, index) => {
        const phase = (360 / n) * index
        return (
          <div
            key={index}
            style={{
              "--duration": `${calculatedDuration}s`,
              "--radius-x": radiusX,
              "--radius-y": radiusY,
              "--phase": `${phase}deg`,
              "--icon-size": `${iconSize}px`,
              animationPlayState: paused ? 'paused' : 'running',
            }}
            className={cn(
              "animate-orbit-ellipse absolute left-1/2 top-1/2 flex size-[var(--icon-size)] -translate-x-1/2 -translate-y-1/2 transform-gpu items-center justify-center rounded-full",
              reverse && "[animation-direction:reverse]",
              className
            )}
            {...props}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}