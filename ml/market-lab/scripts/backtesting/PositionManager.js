
/**
 * PositionManager
 *
 * Utility class for managing trading positions (LONG/SEARCH state machine).
 *
 * - Tracks entry price, loss limit, income limit, and potential income threshold.
 * - Decides whether to BUY, SELL, or HOLD based on predictions and last close price.
 * - Maintains internal counters (bars in position).
 *
 * Decision codes:
 *   1  → BUY
 *   -1 → SELL
 *   0  → HOLD
 */
export default class PositionManager {

    constructor(){
        // Current state: "SEARCH" = no position, "LONG" = holding asset
        this.state = "SEARCH"; 
        this.boughtPrice = -1;              // price at which position was opened
        this.lossLimit = 0.10;              // stop-loss threshold (10%)
        this.incomeLimit = 0.02;            // take-profit threshold (2%)
        this.potentialIncomeLimit = 0.004;  // entry threshold for opening a new position (0.2%)
        this.positionCounter = 0;           // number of bars since position opened
        this.recheckPeriod = 4              // the period of price re-checking after entering a trade
    }

    decide(prediction, lastClose) {
        // Validate inputs
        if(!prediction || !lastClose) {
            throw new Error(`Something went wrong!! prediction or lastClose absent!`);
        }

        // If currently in a LONG position
        if(this.state === "LONG"){
            this.positionCounter++; // increase counter (bars since entry)

            // Stop-loss: if price dropped below threshold → SELL
            if(this.boughtPrice * (1 - this.lossLimit) >= lastClose) {
                this.state = "SEARCH";
                this.positionCounter = 0;
                return {decision: -1}; // SELL
            }

            // Every 4 bars, check if prediction and price suggest further decline → SELL
            if(this.positionCounter % this.recheckPeriod === 0) {
                if(this.boughtPrice > lastClose && prediction < lastClose) {
                    this.state = "SEARCH";
                    this.positionCounter = 0;
                    return {decision: -1}; // SELL
                }
            }
            
            // Profit/loss evaluation
            const difference = lastClose * 100 / this.boughtPrice; // percentage change from entry
            if(difference < 100) {
                // Still below entry → HOLD
                return {decision: 0};
            } else if(difference - 100 > this.incomeLimit * 100) {
                // Price has exceeded profit threshold
                if(prediction > lastClose) {
                    // Prediction says price will keep rising → HOLD
                    return {decision: 0};
                } else {
                    // Otherwise → SELL and lock profit
                    this.state = "SEARCH";
                    this.positionCounter = 0;
                    return {decision: -1};
                }
            } else {
                // Not enough profit yet → HOLD
                return {decision: 0};
            }
            
        } else {
            // If currently not in position ("SEARCH" state)
            // Check if prediction indicates potential rise above threshold → BUY
            if(prediction > lastClose * (1 + this.potentialIncomeLimit)) {
                this.state = "LONG";
                this.boughtPrice = lastClose;
                return {decision: 1}; // BUY
            }
        }

        return {decision: 0}; // Default → HOLD
    }

    // === Config setters ===
    setLossLimit(newLimit) {
        this.lossLimit = newLimit;
    }

    setIncomeLimit(newLimit) {
        this.incomeLimit = newLimit;
    }

    setPotentialIncomeLimit(newLimit) {
        this.potentialIncomeLimit = newLimit;
    }
}
