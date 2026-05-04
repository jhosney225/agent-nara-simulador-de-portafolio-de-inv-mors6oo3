
```javascript
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";

const client = new Anthropic();

// Data structure for portfolio
interface Investment {
  name: string;
  ticker: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
}

interface Portfolio {
  name: string;
  investments: Investment[];
  createdDate: Date;
}

// Create sample portfolio
const portfolio: Portfolio = {
  name: "My Investment Portfolio",
  investments: [
    {
      name: "Apple Inc.",
      ticker: "AAPL",
      quantity: 10,
      purchasePrice: 150,
      currentPrice: 180,
    },
    {
      name: "Microsoft Corporation",
      ticker: "MSFT",
      quantity: 5,
      purchasePrice: 300,
      currentPrice: 380,
    },
    {
      name: "Tesla Inc.",
      ticker: "TSLA",
      quantity: 8,
      purchasePrice: 200,
      currentPrice: 240,
    },
    {
      name: "Amazon.com Inc.",
      ticker: "AMZN",
      quantity: 3,
      purchasePrice: 3500,
      currentPrice: 3800,
    },
    {
      name: "Google (Alphabet Inc.)",
      ticker: "GOOGL",
      quantity: 12,
      purchasePrice: 2800,
      currentPrice: 3100,
    },
  ],
  createdDate: new Date(),
};

// Calculate portfolio metrics
function calculatePortfolioMetrics(portfolio: Portfolio) {
  let totalInvestment = 0;
  let totalCurrentValue = 0;
  const investments = [];

  for (const inv of portfolio.investments) {
    const investmentCost = inv.quantity * inv.purchasePrice;
    const currentValue = inv.quantity * inv.currentPrice;
    const gain = currentValue - investmentCost;
    const gainPercentage = (gain / investmentCost) * 100;

    totalInvestment += investmentCost;
    totalCurrentValue += currentValue;

    investments.push({
      ticker: inv.ticker,
      name: inv.name,
      quantity: inv.quantity,
      purchasePrice: inv.purchasePrice,
      currentPrice: inv.currentPrice,
      investmentCost,
      currentValue,
      gain,
      gainPercentage: gainPercentage.toFixed(2),
    });
  }

  const totalGain = totalCurrentValue - totalInvestment;
  const totalGainPercentage = (totalGain / totalInvestment) * 100;

  return {
    totalInvestment: totalInvestment.toFixed(2),
    totalCurrentValue: totalCurrentValue.toFixed(2),
    totalGain: totalGain.toFixed(2),
    totalGainPercentage: totalGainPercentage.toFixed(2),
    investments,
  };
}

// Generate ASCII chart for portfolio distribution
function generatePortfolioChart(metrics: ReturnType<typeof calculatePortfolioMetrics>) {
  const maxValue = Math.max(...metrics.investments.map((i: { currentValue: number }) => i.currentValue));
  const chartHeight = 20;
  const chartWidth = 60;

  let chart = "Portfolio Value Distribution Chart\n";
  chart += "==================================\n\n";

  for (const inv of metrics.investments) {
    const barWidth = Math.round((inv.currentValue / maxValue) * chartWidth);
    const bar = "█".repeat(barWidth);
    const value = parseFloat(inv.currentValue as unknown as string).toFixed(0);
    chart += `${inv.ticker.padEnd(6)} | ${bar} $${value}\n`;
  }

  return chart;
}

// Generate performance chart
function generatePerformanceChart(metrics: ReturnType<typeof calculatePortfolioMetrics>) {
  let chart = "\nPerformance Overview\n";
  chart += "====================\n\n";

  for (const inv of metrics.investments) {
    const gain = parseFloat(inv.gain as unknown as string);
    const isPositive = gain >= 0;
    const symbol = isPositive ? "▲" : "▼";
    const color = isPositive ? "+" : "-";
    const percentage = parseFloat(inv.gainPercentage as unknown as string);

    const barLength = Math.abs(percentage) / 2;
    const bar = isPositive ? "=".repeat(Math.min(barLength, 30)) : "-".repeat(Math.min(barLength, 30));

    chart += `${inv.ticker.padEnd(6)} ${symbol} ${color}${Math.abs(percentage).toFixed(1)}% | ${bar}\n`;
  }

  return chart;
}

// Main function
async function main() {
  console.log("🚀 Investment Portfolio Simulator\n");
  console.log("================================\n");

  // Calculate metrics
  const metrics = calculatePortfolioMetrics(portfolio);

  // Generate charts
  const portfolioChart = generatePortfolioChart(metrics);
  const performanceChart = generatePerformanceChart(metrics);

  // Display charts
  console.log(portfolioChart);
  console.log(performanceChart);

  // Display summary statistics
  console.log("\nPortfolio Summary Statistics");
  console.log("============================");
  console.log(`Total Investment: $${metrics.totalInvestment}`);
  console.log(`Current Value: $${metrics.totalCurrentValue}`);
  console.log(
    `Total Gain/Loss: $${metrics.totalGain} (${metrics.totalGainPercentage}%)`
  );

  // Detailed breakdown
  console.log("\nDetailed Breakdown");
  console.log("==================");
  console.log(
    "Ticker | Name                      | Qty | Buy Price | Current | Gain    | %"
  );
  console.log(
    "-------|---------------------------|--