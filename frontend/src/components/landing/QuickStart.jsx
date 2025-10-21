import { Card, CardContent } from "@/components/ui/card"
import { User, CreditCard, Settings, TrendingUp } from "lucide-react"
import { Fragment } from "react"

const ArrowLine = ({ className = "w-16 h-16 text-gray-400 dark:text-gray-600" }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M0 32H58"
      stroke="currentColor"
      strokeWidth="4"
      vectorEffect="non-scaling-stroke"
      strokeLinecap="round"
    />
    <path
      d="M52 24L60 32L52 40"
      stroke="currentColor"
      strokeWidth="4"
      vectorEffect="non-scaling-stroke"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function QuickStart() {
  const steps = [
    { icon: User,       title: "Sign Up",     description: "Create account in 1 minute" },
    { icon: CreditCard, title: "Get Access",  description: "Subscribe or use 14-day trial" },
    { icon: Settings,   title: "5-min Setup", description: "Quick configuration: Connect Wallet, Set up Strategy" },
    { icon: TrendingUp, title: "Earn Profit", description: "Launch and watch earnings grow" },
  ]

  return (
    <section id="start" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Start Earning in 5 Minutes</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simple steps from registration to profit - automated trading made accessible
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-[auto_auto_auto_auto_auto_auto_auto] items-start gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-2 justify-items-center relative">
           {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            return (
              <Fragment key={index}>
                <div className="flex flex-col items-center text-center px-2 w-44 min-h-[160px]">
                  <div
                    className={`
                      w-14 h-14 rounded-xl mb-4 flex items-center justify-center
                      border transition-all duration-300 cursor-pointer
                      group relative
                      ${isLast 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700 shadow-lg hover:shadow-green-200/50 dark:hover:shadow-green-800/30 animate-pulse [animation-duration:_3s]' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm'
                      }
                      hover:scale-105
                    `}
                  >
                    {isLast && (
                      <div className="absolute inset-0 rounded-xl bg-green-500/10 animate-ping [animation-duration:_3s] opacity-20" />
                    )}
                    {isLast && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs shadow-md">
                        ★
                      </div>
                    )}
                    <step.icon className={`w-6 h-6 group-hover:scale-110 transition-transform ${isLast ? 'relative z-10' : ''}`} />
                  </div>
                  
                  <h3 className={`font-semibold text-base mb-1 whitespace-nowrap ${isLast ? 'text-green-600 dark:text-green-400' : ''}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm leading-snug min-h-[36px] ${isLast ? 'text-green-500 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                    {step.description}
                  </p>
                </div>

                {/* Горизонтальные стрелки: на десктопе между всеми элементами, на мобильных только внутри рядов */}
                  {index === 0 && (
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 md:static md:flex md:items-center md:justify-center md:-mx-7 md:translate-x-0">
                      <ArrowLine className="w-10 h-10 md:w-16 md:h-16 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute top-[calc(100%-8rem)] left-1/2 -translate-x-1/2 md:static md:flex md:items-center md:justify-center md:-mx-7 md:translate-x-0">
                      <ArrowLine className="w-10 h-10 md:w-16 md:h-16 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                  {index === 1 && (
                    <div className="hidden md:flex items-center justify-center -mx-7">
                      <ArrowLine className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}

                  {index === 1 && (
                    <div className="relative col-span-2 flex md:hidden items-center justify-center w-full">
                      <svg
                        className="absolute left-0 right-0 mx-auto w-[90%] h-18 text-gray-400 dark:text-gray-600"
                        viewBox="0 0 280 130"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Волнистая диагональная линия — две волны, укорочена по вертикали */}
                        <path
                          d="
                            M280 20
                            Q210 60, 140 40
                            T20 100
                          "
                          stroke="currentColor"
                          strokeWidth="4"
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          fill="none"
                        />

                        {/* Наконечник стрелки — точно по направлению линии */}
                        <g transform="translate(20, 100) rotate(120)">
                          <path
                            d="M0 -8 L8 0 L0 8"
                            stroke="currentColor"
                            strokeWidth="4"
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      </svg>
                    </div>
                  )}




              </Fragment>
            );
          })}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 items-stretch">
          <Card className="group hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800 shadow-sm h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-700">
                <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="font-semibold text-xl mb-3">No Coding Required</h3>
              <p className="text-gray-600 dark:text-gray-300 text-md leading-relaxed">
                Everything through intuitive web interface - no technical skills needed for setup
              </p>
              <div className="mt-auto" />
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800 shadow-sm h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-700">
                <CreditCard className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Risk-Free Start</h3>
              <p className="text-gray-600 dark:text-gray-300 text-md leading-relaxed">
                14-day free trial with full features. Cancel anytime without obligations
              </p>
              <div className="mt-auto" />
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-800 shadow-sm h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-700">
                <TrendingUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Instant Setup</h3>
              <p className="text-gray-600 dark:text-gray-300 text-md leading-relaxed">
                Go live in minutes, not days. Start earning immediately after quick configuration
              </p>
              <div className="mt-auto" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}