import { useEffect, useState } from "react";
import ExpenseModal from "./components/ExpenseModal";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("");
  const [show, setShow] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc"); // newest first

  const load = async () => {
    const res = await fetch("http://localhost:5000/expenses");
    setExpenses(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ Filter + sort by date
  const filteredAndSortedExpenses = (filter
    ? expenses.filter(e => e.category === filter)
    : expenses
  ).sort((a, b) => {
    const diff = new Date(a.date) - new Date(b.date);
    return sortOrder === "asc" ? diff : -diff;
  });

  // ✅ Total should be calculated on filtered + sorted data
  const total = filteredAndSortedExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-light bg-light mb-3 px-3">
        <span className="navbar-brand fw-bold">Expense Tracker</span>
        <button className="btn btn-primary" onClick={() => setShow(true)}>
          Add Expense
        </button>
      </nav>

      <ExpenseModal show={show} onClose={() => setShow(false)} onSaved={load} />

      {/* Filters & sorting */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6 d-flex gap-2">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {[...new Set(expenses.map(e => e.category))].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>

        <div className="col-md-6 text-end">
          <h5 className="mb-0">Total: ₹{total}</h5>
        </div>
      </div>

      {/* Expense table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedExpenses.map(e => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>{e.amount}</td>
              <td>{e.category}</td>
              <td>{new Date(e.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
