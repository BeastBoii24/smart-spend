import { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity } from "lucide-react";
import { Transaction } from "@/types/finance";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";

interface TrendChartProps {
  transactions: Transaction[];
}

export default function TrendChart({ transactions }: TrendChartProps) {
  const chartData = useMemo(() => {
    const months: string[] = [];
    const currentDate = new Date();

    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1);
      months.push(date.toISOString().slice(0, 7));
    }

    return months.map((month) => {
      const monthTransactions = transactions.filter((transaction) => transaction.date.startsWith(month));
      const income = monthTransactions
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      const expenses = monthTransactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        name: new Date(`${month}-01`).toLocaleDateString("en-IN", { month: "short" }),
        income,
        expenses,
      };
    });
  }, [transactions]);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Activity size={18} className="text-primary" />
        Six-Month Trend
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 17%)" />
            <XAxis dataKey="name" stroke="hsl(210 20% 72%)" fontSize={12} fontWeight={600} />
            <YAxis
              stroke="hsl(210 20% 72%)"
              fontSize={12}
              fontWeight={600}
              tickFormatter={(value) => formatCompactCurrency(value)}
            />
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
            <Legend formatter={(value) => <span className="font-semibold">{value}</span>} />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
              name="Income"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 5 }}
              name="Expenses"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
