import { useState } from "react";
import { PiggyBank, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Budget, EXPENSE_CATEGORIES } from "@/types/finance";

interface BudgetsSectionProps {
  budgets: Budget[];
  setBudget: (category: string, limit: number) => Promise<{ success: boolean; message: string }>;
  deleteBudget: (category: string) => Promise<{ success: boolean; message: string }>;
}

export default function BudgetsSection({ budgets, setBudget, deleteBudget }: BudgetsSectionProps) {
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleBudgetSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!budgetCategory || !budgetAmount) {
      toast({
        title: "Missing budget details",
        description: "Please choose a category and set the limit.",
        variant: "destructive",
      });
      return;
    }

    const limit = parseFloat(budgetAmount);
    if (limit <= 0) {
      toast({
        title: "Invalid budget limit",
        description: "Budget limit must be a positive number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await setBudget(budgetCategory, limit);

    toast({
      title: result.success ? "Budget Saved" : "Budget Setup Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });

    if (result.success) {
      setBudgetCategory("");
      setBudgetAmount("");
    }
    setIsSubmitting(false);
  };

  const handleDeleteBudget = async (category: string) => {
    const result = await deleteBudget(category);
    toast({
      title: result.success ? "Budget Deleted" : "Delete Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <PiggyBank size={18} className="text-primary animate-bounce" />
          Monthly Budget Setup
        </h3>

        <form onSubmit={handleBudgetSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                <SelectTrigger className="h-10 bg-muted/30 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Limit Amount (INR)</Label>
              <Input
                type="number"
                min="0"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="e.g. 10000"
                className="h-10 bg-muted/30 text-sm"
              />
            </div>
          </div>
          <Button type="submit" size="sm" className="btn-gradient w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Setting..." : "Configure Budget"}
          </Button>
        </form>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
        <h3 className="text-lg font-bold mb-4">Budgets Summary</h3>
        {budgets.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {budgets.map((budget) => {
              const usage = budget.limit > 0 ? Math.min((budget.spent / budget.limit) * 100, 100) : 0;
              const isOverspent = budget.spent > budget.limit;

              return (
                <div key={budget.id} className="p-3 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all border border-border/30">
                  <div className="flex justify-between gap-3 text-sm mb-2">
                    <span className="font-semibold">{budget.category}</span>
                    <span className="text-muted-foreground text-xs text-right">
                      {formatCurrency(budget.spent)} / <span className="font-semibold text-foreground/80">{formatCurrency(budget.limit)}</span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        isOverspent 
                          ? "bg-destructive animate-pulse" 
                          : usage > 85 
                          ? "bg-warning" 
                          : "bg-success"
                      }`}
                      style={{ width: `${usage}%` }} 
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs font-semibold ${
                      isOverspent 
                        ? "text-destructive" 
                        : usage > 85 
                        ? "text-warning" 
                        : "text-success"
                    }`}>
                      {isOverspent ? "Overspent limit!" : `${usage.toFixed(0)}% budget consumed`}
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteBudget(budget.category)} className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-full transition-all">
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-dashed border-border/50 text-center text-sm text-muted-foreground">
            No budgets configured for this month. Set one on the left!
          </div>
        )}
      </div>
    </div>
  );
}
