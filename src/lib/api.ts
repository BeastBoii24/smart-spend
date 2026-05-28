import { Goal, Transaction, Budget, EMIResult, User } from "@/types/finance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export interface ApiMessage {
  success: boolean;
  message: string;
}

interface ApiDataResponse<T> extends ApiMessage {
  data: T;
}

interface ApiUserResponse extends ApiMessage {
  user: User;
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload || payload.success === false) {
    throw new Error(payload?.message || "Request failed. Please try again.");
  }

  return payload as T;
}

export const authApi = {
  login(email: string, password: string) {
    return apiRequest<ApiUserResponse>("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  register(name: string, email: string, password: string) {
    return apiRequest<ApiUserResponse>("/api/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },
  logout() {
    return apiRequest<ApiMessage>("/api/logout", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },
};

export const financeApi = {
  getTransactions(userId: string) {
    return apiRequest<ApiDataResponse<Transaction[]>>(`/api/transactions?userId=${encodeURIComponent(userId)}`);
  },
  addTransaction(payload: Omit<Transaction, "id">) {
    return apiRequest<ApiDataResponse<Transaction>>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateTransaction(id: string, payload: Partial<Transaction>) {
    return apiRequest<ApiDataResponse<Transaction>>(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteTransaction(id: string) {
    return apiRequest<ApiMessage>(`/api/transactions/${id}`, {
      method: "DELETE",
    });
  },
  getBudgets(userId: string) {
    return apiRequest<ApiDataResponse<Budget[]>>(`/api/budgets?userId=${encodeURIComponent(userId)}`);
  },
  setBudget(userId: string, category: string, limit: number) {
    return apiRequest<ApiMessage>("/api/budgets", {
      method: "POST",
      body: JSON.stringify({ userId, category, limit }),
    });
  },
  deleteBudget(userId: string, category: string) {
    return apiRequest<ApiMessage>(`/api/budgets/${encodeURIComponent(category)}?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
  },
  getGoals(userId: string) {
    return apiRequest<ApiDataResponse<Goal[]>>(`/api/goals?userId=${encodeURIComponent(userId)}`);
  },
  addGoal(payload: Omit<Goal, "id" | "createdAt">) {
    return apiRequest<ApiDataResponse<Goal>>("/api/goals", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateGoal(id: string, payload: Partial<Goal>) {
    return apiRequest<ApiDataResponse<Goal>>(`/api/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteGoal(id: string) {
    return apiRequest<ApiMessage>(`/api/goals/${id}`, {
      method: "DELETE",
    });
  },
  calculateEmi(loanAmount: number, interestRate: number, tenure: number) {
    return apiRequest<ApiDataResponse<EMIResult>>("/api/emi", {
      method: "POST",
      body: JSON.stringify({ loanAmount, interestRate, tenure }),
    });
  },
  exportData(userId: string) {
    return apiRequest<ApiDataResponse<{
      transactions: Transaction[];
      budgets: Budget[];
      goals: Goal[];
      exportedAt: string;
    }>>(`/api/export?userId=${encodeURIComponent(userId)}`);
  },
  importData(userId: string, data: unknown) {
    return apiRequest<ApiMessage>("/api/import", {
      method: "POST",
      body: JSON.stringify({ userId, data }),
    });
  },
  clearData(userId: string) {
    return apiRequest<ApiMessage>(`/api/clear?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
  },
};
