import { useEffect, useMemo, useState } from "react";
import { Expense, getExpenses } from "../api/finance";

const currency = new Intl.NumberFormat("es-AR", {
  currency: "ARS",
  style: "currency"
});

const currentMonth = new Date().toISOString().slice(0, 7);
const today = new Date().toISOString().slice(0, 10);
const weekdays = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

const categoryColors: Record<string, string> = {
  alimentacion: "green",
  comida: "green",
  transporte: "blue",
  servicios: "yellow",
  entretenimiento: "purple",
  salud: "red",
  hogar: "cyan",
  compras: "orange",
  educacion: "indigo",
  otros: "gray"
};

const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const getCategoryName = (expense: Expense) => {
  if (!expense.category) {
    return "Sin categoria";
  }

  return typeof expense.category === "string" ? expense.category : expense.category.name;
};

const getCategoryColor = (expense: Expense) => {
  return categoryColors[normalize(getCategoryName(expense))] || categoryColors.otros;
};

const getMonthDays = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(year, monthNumber - 1, 1);
  const startDate = new Date(firstDay);
  const mondayOffset = (firstDay.getDay() + 6) % 7;

  startDate.setDate(firstDay.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);

    date.setDate(startDate.getDate() + index);

    return {
      date,
      key: date.toISOString().slice(0, 10),
      isCurrentMonth: date.getMonth() === monthNumber - 1
    };
  });
};

export const Calendar = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(currentMonth);
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    getExpenses()
      .then(setExpenses)
      .finally(() => setLoading(false));
  }, []);

  const groupedExpenses = useMemo(() => {
    return expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
      const key = expense.date.slice(0, 10);

      acc[key] = [...(acc[key] || []), expense];
      return acc;
    }, {});
  }, [expenses]);

  const monthDays = useMemo(() => getMonthDays(month), [month]);
  const monthExpenses = expenses.filter((expense) => expense.date.slice(0, 7) === month);
  const selectedExpenses = groupedExpenses[selectedDate] || [];
  const totalMonth = monthExpenses.reduce((total, expense) => total + expense.amount, 0);
  const totalSelectedDay = selectedExpenses.reduce((total, expense) => total + expense.amount, 0);
  const daysInMonth = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
  const daysWithExpenses = new Set(monthExpenses.map((expense) => expense.date.slice(0, 10))).size;
  const highestDay = Object.entries(groupedExpenses)
    .filter(([date]) => date.slice(0, 7) === month)
    .map(([date, items]) => ({
      date,
      total: items.reduce((total, expense) => total + expense.amount, 0)
    }))
    .sort((first, second) => second.total - first.total)[0];

  const changeMonth = (value: string) => {
    setMonth(value);
    setSelectedDate(`${value}-01`);
  };

  const moveMonth = (amount: number) => {
    const date = new Date(`${month}-01T00:00:00`);

    date.setMonth(date.getMonth() + amount);
    changeMonth(date.toISOString().slice(0, 7));
  };

  return (
    <section className="space-y-6">
      <div className="calendar-header">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Calendario</h1>
          <p className="text-slate-500">Visualiza tus gastos por dia</p>
        </div>
        <div className="calendar-actions">
          <button className="rounded-md border border-slate-300 px-4 py-2" onClick={() => { setMonth(currentMonth); setSelectedDate(today); }} type="button">
            Hoy
          </button>
          <button className="rounded-md border border-slate-300 px-3 py-2" onClick={() => moveMonth(-1)} type="button">
            {"<"}
          </button>
          <button className="rounded-md border border-slate-300 px-3 py-2" onClick={() => moveMonth(1)} type="button">
            {">"}
          </button>
          <input className="calendar-month-selector rounded-md border border-slate-300 px-3 py-2" onChange={(event) => changeMonth(event.target.value)} type="month" value={month} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <article className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total del mes</p>
          <strong className="mt-2 block text-2xl text-slate-950">{currency.format(totalMonth)}</strong>
          <p className="mt-2 text-sm text-slate-500">{monthExpenses.length} gastos</p>
        </article>
        <article className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Promedio diario</p>
          <strong className="mt-2 block text-2xl text-slate-950">{currency.format(totalMonth / daysInMonth)}</strong>
          <p className="mt-2 text-sm text-slate-500">Este mes</p>
        </article>
        <article className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Dia con mas gastos</p>
          <strong className="mt-2 block text-2xl text-slate-950">{highestDay ? new Date(`${highestDay.date}T00:00:00`).toLocaleDateString("es-AR") : "-"}</strong>
          <p className="mt-2 text-sm text-slate-500">{highestDay ? currency.format(highestDay.total) : "Sin gastos"}</p>
        </article>
        <article className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Dias con gastos</p>
          <strong className="mt-2 block text-2xl text-slate-950">{daysWithExpenses}</strong>
          <p className="mt-2 text-sm text-slate-500">de {daysInMonth} dias</p>
        </article>
      </div>

      <div className="calendar-layout">
        <article className="rounded-md border border-slate-200 bg-white calendar-card">
          {loading && <p className="p-5 text-slate-600">Cargando calendario...</p>}
          {!loading && (
            <div className="calendar-grid">
              {weekdays.map((day) => (
                <div className="calendar-weekday" key={day}>{day}</div>
              ))}
              {monthDays.map((day) => {
                const items = groupedExpenses[day.key] || [];
                const total = items.reduce((sum, expense) => sum + expense.amount, 0);

                return (
                  <button className={`calendar-day${day.isCurrentMonth ? "" : " is-muted"}${day.key === selectedDate ? " is-selected" : ""}`} key={day.key} onClick={() => setSelectedDate(day.key)} type="button">
                    <strong>{day.date.getDate()}</strong>
                    {items.slice(0, 3).map((expense) => (
                      <span className="calendar-expense-line" key={expense._id}>
                        <i className={`calendar-dot calendar-dot-${getCategoryColor(expense)}`} />
                        {getCategoryName(expense)}
                      </span>
                    ))}
                    {total > 0 && <span className="calendar-day-total">Total: {currency.format(total)}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </article>

        <aside className="space-y-4">
          <article className="rounded-md border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">Gastos del {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("es-AR")}</h2>
            {selectedExpenses.length === 0 && <p className="text-sm text-slate-500">No hay gastos en esta fecha.</p>}
            <div className="space-y-3">
              {selectedExpenses.map((expense) => (
                <div className="calendar-detail-row" key={expense._id}>
                  <span>
                    <i className={`calendar-dot calendar-dot-${getCategoryColor(expense)}`} />
                    {getCategoryName(expense)}
                  </span>
                  <strong>{currency.format(expense.amount)}</strong>
                </div>
              ))}
            </div>
            {selectedExpenses.length > 0 && (
              <div className="calendar-detail-total">
                <span>Total del dia</span>
                <strong>{currency.format(totalSelectedDay)}</strong>
              </div>
            )}
          </article>
        </aside>
      </div>
    </section>
  );
};
