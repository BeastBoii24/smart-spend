import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PieChartIcon } from "lucide-react";
import { Transaction } from "@/types/finance";
import { formatCurrency } from "@/lib/utils";

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = ["#0891b2", "#10b981", "#f59e0b", "#ef4444", "#0ea5e9", "#f97316", "#14b8a6", "#84cc16"];

export default function ExpenseChart({ transactions }: ExpenseChartProps) {
  const chartData = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = transactions.filter(
      (transaction) => transaction.type === "expense" && transaction.date.startsWith(currentMonth),
    );

    const categoryMap = new Map<string, number>();
    monthlyExpenses.forEach((transaction) => {
      categoryMap.set(transaction.category, (categoryMap.get(transaction.category) || 0) + transaction.amount);
    });

    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <PieChartIcon size={18} className="text-primary" />
        Monthly Expense Breakdown
      </h3>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <p>No expense data available for the current month.</p>
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={52}
                outerRadius={82}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`expense-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(220 20% 20%)",
                  border: "1px solid hsl(220 20% 40%)",
                  borderRadius: "12px",
                  color: "hsl(0 0% 100%)",
                }}
                labelStyle={{ color: "hsl(0 0% 100%)", fontWeight: "bold" }}
                itemStyle={{ color: "hsl(0 0% 100%)" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm font-semibold text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
