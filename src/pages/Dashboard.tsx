import { useState } from "react";
import { BarChart3, Download, Loader2, PiggyBank, Target, Trash, Trash2, Upload } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import StatsCards from "@/components/dashboard/StatsCards";
import QuickAddForm from "@/components/dashboard/QuickAddForm";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import TrendChart from "@/components/dashboard/TrendChart";
import { useFinanceData } from "@/hooks/useFinanceData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPENSE_CATEGORIES } from "@/types/finance";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

type Section = "dashboard" | "transactions" | "calculator" | "backup";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section>("dashboard");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emiResult, setEmiResult] = useState<{ monthlyEMI: number; totalInterest: number; totalPayable: number } | null>(null);
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCurrent, setGoalCurrent] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [isCalculatingEmi, setIsCalculatingEmi] = useState(false);
  const { toast } = useToast();

  const {
    transactions,
    budgets,
    goals,
    isLoading,
    addTransaction,
    deleteTransaction,
    setBudget,
    deleteBudget,
    addGoal,
    deleteGoal,
    getDashboardStats,
    getReportData,
    calculateEMI,
    exportData,
    importData,
    clearAllData,
  } = useFinanceData();

  const stats = getDashboardStats();
  const reportData = getReportData();

  const showActionToast = (title: string, result: { success: boolean; message: string }) => {
    toast({
      title,
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
  };

  const handleEMICalculate = async () => {
    if (!loanAmount || !interestRate || !tenure) {
      toast({
        title: "Missing values",
        description: "Please enter loan amount, interest rate, and tenure.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculatingEmi(true);
    const result = await calculateEMI(
      parseFloat(loanAmount),
      parseFloat(interestRate),
      parseFloat(tenure),
    );

    if (!result) {
      toast({
        title: "Calculation failed",
        description: "Unable to calculate EMI right now.",
        variant: "destructive",
      });
    } else {
      setEmiResult(result);
    }

    setIsCalculatingEmi(false);
  };

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

    const result = await setBudget(budgetCategory, parseFloat(budgetAmount));
    showActionToast(result.success ? "Budget saved" : "Budget update failed", result);

    if (result.success) {
      setBudgetCategory("");
      setBudgetAmount("");
    }
  };

  const handleGoalSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!goalName || !goalTarget || !goalDate) {
      toast({
        title: "Missing goal details",
        description: "Please enter the goal name, target amount, and target date.",
        variant: "destructive",
      });
      return;
    }

    const result = await addGoal({
      name: goalName,
      targetAmount: parseFloat(goalTarget),
      currentAmount: parseFloat(goalCurrent) || 0,
      targetDate: goalDate,
    });

    showActionToast(result.success ? "Goal saved" : "Goal creation failed", result);

    if (result.success) {
      setGoalName("");
      setGoalTarget("");
      setGoalCurrent("");
      setGoalDate("");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = async (loadEvent) => {
        const result = await importData(String(loadEvent.target?.result || ""));
        showActionToast(result.success ? "Import complete" : "Import failed", result);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExport = async () => {
    const result = await exportData();
    showActionToast(result.success ? "Export complete" : "Export failed", result);
  };

  const handleClearData = async () => {
    const result = await clearAllData();
    showActionToast(result.success ? "Data cleared" : "Unable to clear data", result);
  };

  const handleDeleteTransaction = async (id: string) => {
    const result = await deleteTransaction(id);
    showActionToast(result.success ? "Transaction deleted" : "Delete failed", result);
  };

  const handleDeleteBudget = async (category: string) => {
    const result = await deleteBudget(category);
    showActionToast(result.success ? "Budget deleted" : "Delete failed", result);
  };

  const handleDeleteGoal = async (id: string) => {
    const result = await deleteGoal(id);
    showActionToast(result.success ? "Goal deleted" : "Delete failed", result);
  };

  return (
    <div className="min-h-screen">
      <Header onMenuToggle={() => setMenuOpen(!menuOpen)} isMenuOpen={menuOpen} />
      <Sidebar
        isOpen={menuOpen}
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        onClose={() => setMenuOpen(false)}
      />

      <main className="pt-24 px-4 sm:px-8 pb-8 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              Loading finance data...
            </div>
          </div>
        ) : null}

        {!isLoading && currentSection === "dashboard" && (
          <>
            <StatsCards stats={stats} />

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <QuickAddForm onSubmit={addTransaction} />
              <RecentTransactions transactions={stats.recentTransactions} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <ExpenseChart transactions={transactions} />
              <TrendChart transactions={transactions} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Target size={18} className="text-primary" />
                  Financial Goals
                </h3>

                <form onSubmit={handleGoalSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Goal Name</Label>
                      <Input
                        value={goalName}
                        onChange={(event) => setGoalName(event.target.value)}
                        placeholder="Emergency Fund"
                        className="h-10 bg-muted/30 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Target Amount</Label>
                      <Input
                        type="number"
                        min="0"
                        value={goalTarget}
                        onChange={(event) => setGoalTarget(event.target.value)}
                        className="h-10 bg-muted/30 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Current Saved</Label>
                      <Input
                        type="number"
                        min="0"
                        value={goalCurrent}
                        onChange={(event) => setGoalCurrent(event.target.value)}
                        className="h-10 bg-muted/30 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Target Date</Label>
                      <Input
                        type="date"
                        value={goalDate}
                        onChange={(event) => setGoalDate(event.target.value)}
                        className="h-10 bg-muted/30 text-sm"
                      />
                    </div>
                  </div>
                  <Button type="submit" size="sm" className="bg-success hover:bg-success/90 w-full sm:w-auto">
                    Add Goal
                  </Button>
                </form>

                {goals.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-56 overflow-y-auto">
                    {goals.map((goal) => {
                      const progress = goal.targetAmount > 0
                        ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
                        : 0;

                      return (
                        <div key={goal.id} className="p-3 rounded-lg bg-muted/20 flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between gap-3 text-sm">
                              <span className="font-medium truncate">{goal.name}</span>
                              <span className="text-muted-foreground shrink-0">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full mt-1">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)} by {goal.targetDate}
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteGoal(goal.id)} className="h-8 w-8 p-0">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-primary" />
                  Financial Summary
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="stat-card rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-success">{formatCurrency(reportData.totalIncome)}</div>
                    <div className="text-xs text-muted-foreground">Income</div>
                  </div>
                  <div className="stat-card rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-destructive">{formatCurrency(reportData.totalExpenses)}</div>
                    <div className="text-xs text-muted-foreground">Expenses</div>
                  </div>
                  <div className="stat-card rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-primary">{formatCurrency(reportData.netSavings)}</div>
                    <div className="text-xs text-muted-foreground">Net Savings</div>
                  </div>
                </div>

                <h4 className="font-semibold text-sm mb-2">Category Breakdown</h4>
                {reportData.categoryBreakdown.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No expense data available.</p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {reportData.categoryBreakdown.map((category) => (
                      <div key={category.category} className="flex items-center gap-2 text-sm">
                        <span className="w-24 truncate">{category.category}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${category.percentage}%` }} />
                        </div>
                        <span className="w-20 text-right text-xs">{formatCurrency(category.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <PiggyBank size={18} className="text-primary" />
                  Monthly Budget
                </h3>

                <form onSubmit={handleBudgetSubmit} className="space-y-3">
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
                      <Label className="text-xs">Limit Amount</Label>
                      <Input
                        type="number"
                        min="0"
                        value={budgetAmount}
                        onChange={(event) => setBudgetAmount(event.target.value)}
                        className="h-10 bg-muted/30 text-sm"
                      />
                    </div>
                  </div>
                  <Button type="submit" size="sm" className="btn-gradient w-full sm:w-auto">
                    Set Budget
                  </Button>
                </form>
              </div>

              <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
                <h3 className="text-lg font-bold mb-4">Budget Overview</h3>
                {budgets.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No budgets set for the current month.</p>
                ) : (
                  <div className="space-y-3 max-h-56 overflow-y-auto">
                    {budgets.map((budget) => {
                      const usage = budget.limit > 0 ? Math.min((budget.spent / budget.limit) * 100, 100) : 0;

                      return (
                        <div key={budget.id} className="p-3 rounded-lg bg-muted/20">
                          <div className="flex justify-between gap-3 text-sm mb-1">
                            <span className="font-medium">{budget.category}</span>
                            <span className="text-muted-foreground text-right">
                              {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full">
                            <div className="h-full progress-gradient rounded-full" style={{ width: `${usage}%` }} />
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className={`text-xs ${
                              usage > 90 ? "text-destructive" : usage > 70 ? "text-warning" : "text-success"
                            }`}>
                              {usage.toFixed(0)}% used
                            </span>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteBudget(budget.category)} className="h-6 w-6 p-0">
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {!isLoading && currentSection === "transactions" && (
          <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
            <h2 className="text-xl font-bold mb-4">All Transactions</h2>

            {transactions.length === 0 ? (
              <p className="text-muted-foreground">No transactions available yet.</p>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-3 text-left text-muted-foreground text-sm">Date</th>
                        <th className="py-3 text-left text-muted-foreground text-sm">Type</th>
                        <th className="py-3 text-left text-muted-foreground text-sm">Category</th>
                        <th className="py-3 text-left text-muted-foreground text-sm">Note</th>
                        <th className="py-3 text-right text-muted-foreground text-sm">Amount</th>
                        <th className="py-3 text-right text-muted-foreground text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="py-3">{transaction.date}</td>
                          <td className="py-3">
                            <span className={transaction.type === "income" ? "text-success" : "text-destructive"}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="py-3">{transaction.category}</td>
                          <td className="py-3 text-muted-foreground">{transaction.note || "-"}</td>
                          <td className={`py-3 text-right font-semibold ${
                            transaction.type === "income" ? "text-success" : "text-destructive"
                          }`}>
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="py-3 text-right">
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteTransaction(transaction.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="rounded-xl border border-border/50 bg-muted/10 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{transaction.category}</p>
                          <p className="text-sm text-muted-foreground">{transaction.note || "No note added"}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteTransaction(transaction.id)} className="h-8 w-8 p-0">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p>{transaction.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className={transaction.type === "income" ? "text-success" : "text-destructive"}>
                            {transaction.type}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Amount</p>
                          <p className={`font-semibold ${
                            transaction.type === "income" ? "text-success" : "text-destructive"
                          }`}>
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {!isLoading && currentSection === "calculator" && (
          <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
            <h2 className="text-xl font-bold mb-6">EMI Calculator</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <Label>Loan Amount (INR)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={loanAmount}
                    onChange={(event) => setLoanAmount(event.target.value)}
                    placeholder="500000"
                    className="h-11 bg-muted/30"
                  />
                </div>
                <div>
                  <Label>Interest Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={interestRate}
                    onChange={(event) => setInterestRate(event.target.value)}
                    placeholder="8.5"
                    className="h-11 bg-muted/30"
                  />
                </div>
                <div>
                  <Label>Tenure (Years)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={tenure}
                    onChange={(event) => setTenure(event.target.value)}
                    placeholder="5"
                    className="h-11 bg-muted/30"
                  />
                </div>
                <Button onClick={handleEMICalculate} className="btn-gradient w-full sm:w-auto" disabled={isCalculatingEmi}>
                  {isCalculatingEmi ? "Calculating..." : "Calculate EMI"}
                </Button>
              </div>

              <div className="p-6 rounded-xl bg-muted/20">
                <h4 className="font-semibold mb-4">EMI Details</h4>
                {emiResult ? (
                  <div className="space-y-3">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Monthly EMI</span>
                      <span className="font-bold text-primary text-xl">{formatCurrency(emiResult.monthlyEMI)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Total Interest</span>
                      <span className="font-semibold text-warning">{formatCurrency(emiResult.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Total Payable</span>
                      <span className="font-semibold">{formatCurrency(emiResult.totalPayable)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Enter loan details to calculate EMI.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {!isLoading && currentSection === "backup" && (
          <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
            <h2 className="text-xl font-bold mb-6">Data Backup & Restore</h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Button onClick={handleExport} className="btn-gradient w-full sm:w-auto">
                <Download size={18} className="mr-2" />
                Export Data
              </Button>
              <Button onClick={handleImport} variant="outline" className="w-full sm:w-auto">
                <Upload size={18} className="mr-2" />
                Import Data
              </Button>
              <Button onClick={handleClearData} variant="destructive" className="w-full sm:w-auto">
                <Trash size={18} className="mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
