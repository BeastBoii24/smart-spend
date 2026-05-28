import { CreditCard, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types/finance";

interface TransactionsSectionProps {
  transactions: Transaction[];
  deleteTransaction: (id: string) => Promise<{ success: boolean; message: string }>;
}

export default function TransactionsSection({ transactions, deleteTransaction }: TransactionsSectionProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <CreditCard size={20} className="text-primary animate-pulse" />
        Complete Financial Ledger
      </h2>

      {transactions.length > 0 ? (
        <>
          {/* Desktop Table View (Hidden on Mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground tracking-wider font-semibold">
                  <th className="py-3 text-left">Date</th>
                  <th className="py-3 text-left">Type</th>
                  <th className="py-3 text-left">Category</th>
                  <th className="py-3 text-left">Memo / Note</th>
                  <th className="py-3 text-right">Amount</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  const isIncome = transaction.type === "income";
                  return (
                    <tr key={transaction.id} className="border-b border-border/40 hover:bg-muted/20 transition-all">
                      <td className="py-3.5 text-sm font-medium">{transaction.date}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                          isIncome 
                            ? "bg-success/10 text-success border border-success/20" 
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="py-3.5 text-sm font-medium">{transaction.category}</td>
                      <td className="py-3.5 text-sm text-muted-foreground max-w-xs truncate">{transaction.note || "-"}</td>
                      <td className={`py-3.5 text-right font-bold text-sm ${
                        isIncome ? "text-success" : "text-destructive"
                      }`}>
                        {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-3.5 text-right">
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(transaction.id)} className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive rounded-full text-muted-foreground transition-all">
                          <Trash2 size={15} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View (Hidden on Desktop) */}
          <div className="md:hidden space-y-3">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === "income";
              return (
                <div key={transaction.id} className="rounded-xl border border-border/40 bg-muted/10 p-4 hover:border-border transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-base">{transaction.category}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{transaction.note || "No memo added"}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(transaction.id)} className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-full shrink-0">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div>
                      <p className="text-muted-foreground text-xxs uppercase tracking-wider mb-0.5">Date</p>
                      <p className="font-medium text-foreground">{transaction.date}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xxs uppercase tracking-wider mb-0.5">Type</p>
                      <span className={`inline-flex px-1.5 py-0.5 text-xxs font-semibold rounded uppercase tracking-wider ${
                        isIncome 
                          ? "bg-success/10 text-success border border-success/10" 
                          : "bg-destructive/10 text-destructive border border-destructive/10"
                      }`}>
                        {transaction.type}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground text-xxs uppercase tracking-wider mb-0.5">Amount</p>
                      <p className={`font-extrabold text-sm ${
                        isIncome ? "text-success" : "text-destructive"
                      }`}>
                        {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="p-8 rounded-xl border border-dashed border-border text-center text-muted-foreground text-sm">
          No ledger entries available. Add your first transaction in the main dashboard view!
        </div>
      )}
    </div>
  );
}
