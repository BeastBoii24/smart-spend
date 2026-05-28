import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import StatsCards from "@/components/dashboard/StatsCards";
import QuickAddForm from "@/components/dashboard/QuickAddForm";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import TrendChart from "@/components/dashboard/TrendChart";
import EMICalculator from "@/components/dashboard/EMICalculator";
import GoalsSection from "@/components/dashboard/GoalsSection";
import BudgetsSection from "@/components/dashboard/BudgetsSection";
import BackupRestoreSection from "@/components/dashboard/BackupRestoreSection";
import TransactionsSection from "@/components/dashboard/TransactionsSection";
import { useFinanceData } from "@/hooks/useFinanceData";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, Loader2 } from "lucide-react";

type Section = "dashboard" | "transactions" | "calculator" | "backup";

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section>("dashboard");

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

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      {/* Central Navigation Header */}
      <Header onMenuToggle={() => setMenuOpen(!menuOpen)} isMenuOpen={menuOpen} />
      
      {/* Sliding Collapsible Drawer Sidebar */}
      <Sidebar
        isOpen={menuOpen}
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        onClose={() => setMenuOpen(false)}
      />

      {/* Main Content Layout Container */}
      <main className="pt-24 px-4 sm:px-8 pb-8 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 size={36} className="animate-spin text-primary" />
            <p className="text-sm font-medium tracking-wide">Syncing account database ledger...</p>
          </div>
        ) : (
          <>
            {/* View Section 1: Core Dashboard Workspace */}
            {currentSection === "dashboard" && (
              <div className="space-y-6">
                {/* Visual Overview KPI Widgets */}
                <StatsCards stats={stats} />

                {/* Grid: Quick Add form & Recent List */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <QuickAddForm onSubmit={addTransaction} />
                  <RecentTransactions transactions={stats.recentTransactions} />
                </div>

                {/* Grid: Charts & Analytics */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <ExpenseChart transactions={transactions} />
                  <TrendChart transactions={transactions} />
                </div>

                {/* Grid: Goals & Summary Reports */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <GoalsSection goals={goals} addGoal={addGoal} deleteGoal={deleteGoal} />
                  
                  <div className="glass-card rounded-2xl p-4 sm:p-6 animate-slide-in">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <BarChart3 size={18} className="text-primary" />
                      Analytical Summary
                    </h3>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="stat-card rounded-xl p-3 text-center bg-success/5 border border-success/15 hover:bg-success/10 transition-all">
                        <div className="text-sm sm:text-base font-bold text-success truncate">{formatCurrency(reportData.totalIncome)}</div>
                        <div className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold mt-1">Income</div>
                      </div>
                      <div className="stat-card rounded-xl p-3 text-center bg-destructive/5 border border-destructive/15 hover:bg-destructive/10 transition-all">
                        <div className="text-sm sm:text-base font-bold text-destructive truncate">{formatCurrency(reportData.totalExpenses)}</div>
                        <div className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold mt-1">Expenses</div>
                      </div>
                      <div className="stat-card rounded-xl p-3 text-center bg-primary/5 border border-primary/15 hover:bg-primary/10 transition-all">
                        <div className="text-sm sm:text-base font-bold text-primary truncate">{formatCurrency(reportData.netSavings)}</div>
                        <div className="text-xxs uppercase tracking-wider text-muted-foreground font-semibold mt-1">Net Saved</div>
                      </div>
                    </div>

                    <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">Category Consumption Breakdown</h4>
                    {reportData.categoryBreakdown.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                        No expense analytics available. Add expenses to view.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                        {reportData.categoryBreakdown.map((category) => (
                          <div key={category.category} className="flex items-center gap-3 text-sm">
                            <span className="w-24 truncate font-medium">{category.category}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${category.percentage}%` }} />
                            </div>
                            <span className="w-20 text-right text-xs font-semibold">{formatCurrency(category.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Full-width budgets interface */}
                <BudgetsSection budgets={budgets} setBudget={setBudget} deleteBudget={deleteBudget} />
              </div>
            )}

            {/* View Section 2: Complete Transaction Ledger */}
            {currentSection === "transactions" && (
              <TransactionsSection transactions={transactions} deleteTransaction={deleteTransaction} />
            )}

            {/* View Section 3: EMI repyament Calculator */}
            {currentSection === "calculator" && (
              <EMICalculator calculateEMI={calculateEMI} />
            )}

            {/* View Section 4: Offline Backup restoration */}
            {currentSection === "backup" && (
              <BackupRestoreSection exportData={exportData} importData={importData} clearAllData={clearAllData} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
