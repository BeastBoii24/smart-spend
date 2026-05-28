import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Budget, DashboardStats, EMIResult, Goal, ReportData, Transaction } from "@/types/finance";
import { financeApi } from "@/lib/api";

interface ActionResult {
  success: boolean;
  message: string;
}

export function useFinanceData() {
  const { userId } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!userId) {
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      return;
    }

    try {
      setIsLoading(true);
      const [transactionsResponse, budgetsResponse, goalsResponse] = await Promise.all([
        financeApi.getTransactions(userId),
        financeApi.getBudgets(userId),
        financeApi.getGoals(userId),
      ]);

      setTransactions(transactionsResponse.data);
      setBudgets(budgetsResponse.data);
      setGoals(goalsResponse.data);
    } catch (error) {
      console.error("Unable to load finance data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const failureResult = (fallbackMessage: string, error: unknown): ActionResult => ({
    success: false,
    message: error instanceof Error ? error.message : fallbackMessage,
  });

  const addTransaction = useCallback(async (data: Omit<Transaction, "id" | "userId">): Promise<ActionResult> => {
    if (!userId) {
      return { success: false, message: "Please login to add a transaction." };
    }

    try {
      const response = await financeApi.addTransaction({ ...data, userId });
      await loadData();
      return { success: true, message: response.message };
    } catch (error) {
      return failureResult("Unable to add transaction.", error);
    }
  }, [loadData, userId]);

  const updateTransaction = useCallback(async (id: string, data: Partial<Transaction>): Promise<ActionResult> => {
    try {
      const response = await financeApi.updateTransaction(id, data);
      await loadData();
      return { success: true, message: response.message };
    } catch (error) {
      return failureResult("Unable to update transaction.", error);
    }
  }, [loadData]);

  const deleteTransaction = useCallback(async (id: string): Promise<ActionResult> => {
    try {
      const response = await financeApi.deleteTransaction(id);
      await loadData();
      return { success: true, message: response.message };
    } catch (error) {
      return failureResult("Unable to delete transaction.", error);
    }
  }, [loadData]);

  const setBudget = useCallback(async (category: string, limit: number): Promise<ActionResult> => {
    if (!userId) {
      return { success: false, message: "Please login to manage budgets." };
    }

    try {
      const response = await financeApi.setBudget(userId, category, limit);
      await loadData();
      return { success: true, message: response.message };
    } catch (error) {
      return failureResult("Unable to save budget.", error);
    }
  }, [loadData, userId]);

  const deleteBudget = useCallback(async (category: string): Promise<ActionResult> => {
    if (!userId) {
      return { success: false, message: "Please login to manage budgets." };
    }

    try {
      const response = await financeApi.deleteBudget(userId, category);
      await loadData();
      return { success: true, message: response.message };
    } catch (error) {
      return failureResult("Unable to delete budget.", error);
    }
  }, [loadData, userId]);

  const addGoal = useCallback(async (data: Omit<Goal, "id" | "userId" | "createdAt">): Promise<ActionResult> => {
    if (!userId) {
      return { success: false, message: "Please login to add goals." };
    }

    try {
      const response = await financeApi.addGoal({ ...data, userId });
      await loadData();
      return { success: true, message: response.message };
    } catch (error) {
      return failureResult("Unable to add goal.", error);
    }
  }, [loadData, userId]);

  const updateGoal = useCallback(async (id: string, data: Partial<Goal>): Promise<ActionResult> => {
    try {
      const response = await financeApi.updateGoal(id, data);
      await loadData();
      return { success: true, message: response.message };
    } catch (error) {
      return failureResult("Unable to update goal.", error);
    }
  }, [loadData]);

  const deleteGoal = useCallback(async (id: string): Promise<ActionResult> => {
    try {
      const response = await financeApi.deleteGoal(id);
      await loadData();
      return { success: true, message: response.message };
    } catch (error) {
      return failureResult("Unable to delete goal.", error);
    }
  }, [loadData]);

  const getDashboardStats = useCallback((): DashboardStats => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTransactions = transactions.filter((transaction) => transaction.date.startsWith(currentMonth));

    const monthlyIncome = monthlyTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalBalance = totalIncome - totalExpenses;
    const savingsRate = monthlyIncome > 0
      ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
      : 0;

    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      recentTransactions,
    };
  }, [transactions]);

  const getReportData = useCallback((): ReportData => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const netSavings = totalIncome - totalExpenses;
    const categoryMap = new Map<string, number>();

    transactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        categoryMap.set(transaction.category, (categoryMap.get(transaction.category) || 0) + transaction.amount);
      });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    }));

    return { totalIncome, totalExpenses, netSavings, categoryBreakdown };
  }, [transactions]);

  const calculateEMI = useCallback(async (principal: number, rate: number, tenure: number): Promise<EMIResult | null> => {
    try {
      const response = await financeApi.calculateEmi(principal, rate, tenure);
      return response.data;
    } catch (error) {
      console.error("Unable to calculate EMI:", error);
      return null;
    }
  }, []);

  const exportData = useCallback(async (): Promise<ActionResult> => {
    if (!userId) {
      return { success: false, message: "Please login to export data." };
    }

    try {
      const response = await financeApi.exportData(userId);
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `smartspend_backup_${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      return { success: true, message: "Data exported successfully." };
    } catch (error) {
      return failureResult("Unable to export data.", error);
    }
  }, [userId]);

  const importData = useCallback(async (jsonString: string): Promise<ActionResult> => {
    if (!userId) {
      return { success: false, message: "Please login to import data." };
    }

    try {
      const parsedData = JSON.parse(jsonString);
      const response = await financeApi.importData(userId, parsedData);
      await loadData();
      return { success: true, message: response.message };
    } catch (error) {
      return failureResult("Unable to import data. Please check the JSON file.", error);
    }
  }, [loadData, userId]);

  const clearAllData = useCallback(async (): Promise<ActionResult> => {
    if (!userId) {
      return { success: false, message: "Please login to clear data." };
    }

    try {
      const response = await financeApi.clearData(userId);
      await loadData();
      return { success: true, message: response.message };
    } catch (error) {
      return failureResult("Unable to clear data.", error);
    }
  }, [loadData, userId]);

  const getBudgetsWithSpent = useCallback(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return budgets
      .filter((budget) => budget.month === currentMonth)
      .map((budget) => ({
        ...budget,
        spent: transactions
          .filter((transaction) =>
            transaction.category === budget.category &&
            transaction.type === "expense" &&
            transaction.date.startsWith(currentMonth))
          .reduce((sum, transaction) => sum + transaction.amount, 0),
      }));
  }, [budgets, transactions]);

  return {
    transactions,
    budgets: getBudgetsWithSpent(),
    goals,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudget,
    deleteBudget,
    addGoal,
    updateGoal,
    deleteGoal,
    getDashboardStats,
    getReportData,
    calculateEMI,
    exportData,
    importData,
    clearAllData,
    refreshData: loadData,
  };
}
