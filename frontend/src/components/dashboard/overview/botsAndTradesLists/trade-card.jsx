import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export function TradeCard({ trade }) {
  return (
    <Card className="shadow-md overflow-hidden w-full bg-gradient-to-t from-primary/5 to-card dark:bg-card">
      <CardHeader className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between w-full">
             <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <CardTitle className="relative inline-block">
                      <div className="text-xl font-bold">
                        {trade.tokenIn + "/" + trade.tokenOut}
                      </div>
                      <img
                        src="/src/assets/arbitrum-logo.png"
                        alt=" "
                        className="absolute -bottom-1 -right-2 w-4 h-4 rounded-sm border border-white shadow"
                      />
                    </CardTitle>
                </div>
                <div className="pt-1">
                    <Badge variant="secondary" className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          trade.status === "open"
                            ? "bg-green-500"
                            : trade.status === "closed"
                            ? "bg-gray-400"
                            : "bg-red-500"
                        }`}
                      />
                      {trade.status === "open"
                        ? "Open"
                        : trade.status === "closed"
                        ? "Closed"
                        : "Failed"}
                    </Badge> 
                </div>
             </div>
             {trade.status === "closed" ? 
              <div className="flex flex-col leading-tight items-end">
                <span className="text-muted-foreground text-xs"> {trade.profitAbs >= 0 ? 'Profit' : 'Loss'}</span>
                <span className={`text-lg font-bold ${
                    trade.profitAbs >= 0 ? "text-green-500" : "text-red-500"
                  }`}>
                  {trade.profitAbs >= 0
                    ? `+${Number(trade.profitAbs).toFixed(2) + " " + trade.tokenIn}`
                    : `-${Math.abs(Number(trade.profitAbs)).toFixed(2) + " " + trade.tokenIn}`}
                </span>
              </div> : <></>}
              

                {/*<img
                    src="/src/assets/stonks.png"
                    alt="meme"
                    className="w-18 h-10 rounded-sm border border-white shadow"
                />*/}
          </div>
        </CardHeader>

      <Separator />
      <div className="px-6 flex flex-col lg:flex-row  gap-4">
          {/* Buy Operation */}
          <div className="flex-1 flex flex-col gap-2 rounded-lg p-4">
            <div className="flex w-full items-center justify-between">
                <Badge className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    BUY
                </Badge>
              
                {trade.operations?.BuyOperation ? (
                  <span className="text-xs text-muted-foreground font-bold">
                    {new Date(trade.operations.BuyOperation.createdAt).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })} ·{" "}
                    {new Date(trade.operations.BuyOperation.createdAt).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground font-bold">—</span>
                )}
            </div>
            <span className="text-sm font-semibold">
              {trade.operations?.BuyOperation
                ? `${Number(trade.operations.BuyOperation.filledAmountIn).toFixed(4) + " " +  trade.tokenIn} → ${Number(trade.operations.BuyOperation.receivedAmountOut).toFixed(4)+ " " + trade.tokenOut}`
                : "—"}
            </span>
            {trade.operations?.BuyOperation ? (
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  variant="link"
                  className="px-0 text-xs justify-start h-auto w-[50px]"
                  asChild
                >
                  <a
                    href={`https://arbiscan.io/tx/${trade.operations.BuyOperation.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tx: {trade.operations.BuyOperation.txHash.slice(0, 10)}...
                  </a>
                </Button>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">not executed</span>
            )}
          </div>
            <Separator
              orientation="horizontal"
              className="lg:hidden"
            />
            <Separator
              orientation="vertical"
              className="hidden lg:block h-auto"
            />
          {/* Sell Operation */}
          <div className="flex-1 flex flex-col gap-2 rounded-lg p-4">
            <div className="flex w-full items-center justify-between">
                <Badge className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    SELL
                </Badge>
              
                {trade.operations?.SellOperation ? (
                  <span className="text-xs text-muted-foreground font-bold">
                    {new Date(trade.operations.SellOperation.createdAt).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })} ·{" "}
                    {new Date(trade.operations.SellOperation.createdAt).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground font-bold">—</span>
                )}
            </div>
            <span className="text-sm font-semibold">
              {trade.operations?.SellOperation
                ? `${Number(trade.operations.SellOperation.filledAmountIn).toFixed(4) + " " + trade.tokenOut} → ${Number(trade.operations.SellOperation.receivedAmountOut).toFixed(4) + " " +  trade.tokenIn}`
                : "—"}
            </span>
            <span className="text-xs text-muted-foreground">
              {trade.operations?.SellOperation ? (
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="link"
                      className="px-0 text-xs justify-start h-auto w-[50px]"
                      asChild
                    >
                      <a
                        href={`https://arbiscan.io/tx/${trade.operations.SellOperation.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Tx: {trade.operations.SellOperation.txHash.slice(0, 10)}...
                      </a>
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">not executed</span>
                )}
            </span>
          </div>
        </div>
    </Card>
  )
}
