import { SectionCards } from "@/components/dashboard/overview/section-cards"
import { ChartArea } from "@/components/dashboard/overview/chart-area.jsx"
import { BotsTradesCards } from "@/components/dashboard/overview/bots-trades-cards.jsx"

export default function DashboardOverview() {
  return (
    <>
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartArea />
        </div>
        <BotsTradesCards/>
    </>
  )
}
