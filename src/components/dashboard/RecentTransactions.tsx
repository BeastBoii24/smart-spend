import { ClipboardList, TrendingDown, TrendingUp } from "lucide-react";
import { Transaction } from "@/types/finance";
import { formatCurrency } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatDate = (dateString: string) => (
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  );

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in" style={{ animationDelay: "0.1s" }}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ClipboardList size={18} className="text-primary" />
        Recent Transactions
      </h3>

      {transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No transactions found.</p>
          <p className="text-sm mt-1">Add your first entry to populate the dashboard.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                  transaction.type === "income"
                    ? "bg-success/20 text-success"
                    : "bg-destructive/20 text-destructive"
                }`}>
                  {transaction.type === "income" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{transaction.category}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {transaction.note || formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div className={`text-right font-semibold shrink-0 ${
                transaction.type === "income" ? "text-success" : "text-destructive"
              }`}>
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
