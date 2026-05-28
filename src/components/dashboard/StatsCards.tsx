import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { DashboardStats } from "@/types/finance";
import { formatCompactCurrency } from "@/lib/utils";

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Balance",
      value: formatCompactCurrency(stats.totalBalance),
      icon: Wallet,
      color: stats.totalBalance >= 0 ? "text-primary" : "text-destructive",
    },
    {
      label: "Monthly Income",
      value: formatCompactCurrency(stats.monthlyIncome),
      icon: TrendingUp,
      color: "text-success",
    },
    {
      label: "Monthly Expenses",
      value: formatCompactCurrency(stats.monthlyExpenses),
      icon: TrendingDown,
      color: "text-destructive",
    },
    {
      label: "Savings Rate",
      value: `${stats.savingsRate}%`,
      icon: PiggyBank,
      color: stats.savingsRate >= 20 ? "text-success" : "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="stat-card rounded-2xl p-5 text-center animate-slide-in hover:scale-[1.02] transition-transform duration-300"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={`text-2xl sm:text-3xl font-extrabold mb-2 ${card.color}`}>
            {card.value}
          </div>
          <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <card.icon size={16} className="opacity-70" />
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}
