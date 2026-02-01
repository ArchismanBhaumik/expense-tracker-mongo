import { useState } from "react";

export default function ExpenseModal({ show, onClose, onSaved }) {
  const today = new Date().toISOString().split("T")[0];

  const [data, setData] = useState({
    title: "",
    amount: "",
    category: "",
    date: today
  });

  if (!show) return null;

  const submit = async () => {
    if (!data.title || !data.category || data.amount <= 0 || !data.date) {
      return alert("Please fill all fields correctly");
    }

    await fetch("https://expense-tracker-backend-ogto.onrender.com/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        amount: Number(data.amount)
      })
    });

    onSaved();
    onClose();
    setData({
    title: "",
    amount: "",
    category: "",
    date: today
  });
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5 className="mb-3">Add Expense</h5>

          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control mb-2"
            value={data.title}
            onChange={e => setData({ ...data, title: e.target.value })}
          />

          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control mb-2"
            value={data.amount}
            onChange={e => setData({ ...data, amount: e.target.value })}
          />

          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control mb-2"
            value={data.category}
            onChange={e => setData({ ...data, category: e.target.value })}
          />

          <label className="form-label">Date of Expense</label>
          <input
            type="date"
            className="form-control mb-3"
            value={data.date}
            onChange={e => setData({ ...data, date: e.target.value })}
          />

          {/* ✅ Proper button alignment */}
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={submit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
