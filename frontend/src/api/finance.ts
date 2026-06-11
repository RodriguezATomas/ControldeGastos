import { api } from "./client";

export type Category = {
  _id: string;
  name: string;
};

export type Expense = {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: Category | string | null;
  paymentMethod?: string;
};

export type ExpensePayload = {
  description: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
};

export type Budget = {
  _id: string;
  amount: number;
  month: number;
  year: number;
};

export type BudgetPayload = {
  amount: number;
  month: number;
  year: number;
};

export type Goal = {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
};

export type GoalPayload = {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
};

export type DashboardData = {
  totalGastado: number;
  gastoPromedio: number;
  mayorGasto: number;
  presupuestoDisponible: number;
  presupuestoMensual: number;
  presupuestoUsado: number;
  gastosPorCategoria: Array<{
    _id: string;
    categoria: string;
    total: number;
  }>;
  evolucionMensual: Array<{
    year: number;
    month: number;
    total: number;
  }>;
};

export const getDashboard = async (month?: string) => {
  const { data } = await api.get<DashboardData>("/dashboard", { params: { month } });

  return data;
};

export const getExpenses = async () => {
  const { data } = await api.get<Expense[]>("/expenses");

  return data;
};

export const createExpense = async (payload: ExpensePayload) => {
  const { data } = await api.post<Expense>("/expenses", payload);

  return data;
};

export const updateExpense = async (id: string, payload: ExpensePayload) => {
  const { data } = await api.patch<Expense>(`/expenses/${id}`, payload);

  return data;
};

export const deleteExpense = async (id: string) => {
  await api.delete(`/expenses/${id}`);
};

export const getCategories = async () => {
  const { data } = await api.get<Category[]>("/categories");

  return data;
};

export const createCategory = async (name: string) => {
  const { data } = await api.post<Category>("/categories", { name });

  return data;
};

export const updateCategory = async (id: string, name: string) => {
  const { data } = await api.patch<Category>(`/categories/${id}`, { name });

  return data;
};

export const deleteCategory = async (id: string) => {
  await api.delete(`/categories/${id}`);
};

export const getBudgets = async () => {
  const { data } = await api.get<Budget[]>("/budgets");

  return data;
};

export const createBudget = async (payload: BudgetPayload) => {
  const { data } = await api.post<Budget>("/budgets", payload);

  return data;
};

export const updateBudget = async (id: string, payload: BudgetPayload) => {
  const { data } = await api.patch<Budget>(`/budgets/${id}`, payload);

  return data;
};

export const getGoals = async () => {
  const { data } = await api.get<Goal[]>("/goals");

  return data;
};

export const createGoal = async (payload: GoalPayload) => {
  const { data } = await api.post<Goal>("/goals", payload);

  return data;
};

export const updateGoal = async (id: string, payload: GoalPayload) => {
  const { data } = await api.patch<Goal>(`/goals/${id}`, payload);

  return data;
};

export const deleteGoal = async (id: string) => {
  await api.delete(`/goals/${id}`);
};

export const downloadReport = async (format: "pdf" | "excel") => {
  const { data } = await api.get<Blob>(`/reports/${format}`, { responseType: "blob" });
  const url = window.URL.createObjectURL(data);
  const link = document.createElement("a");

  link.href = url;
  link.download = format === "pdf" ? "reporte-gastos.pdf" : "reporte-gastos.xls";
  link.click();
  window.URL.revokeObjectURL(url);
};
