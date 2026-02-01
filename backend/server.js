
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: { type: Number, min: 0 },
  category: String,
  date: Date
}, { timestamps: true });

const Expense = mongoose.model("Expense", expenseSchema);

app.get("/expenses", async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
});

app.post("/expenses", async (req, res) => {
  const { title, amount, category, date } = req.body;
  if (amount < 0 || !date) return res.status(400).json({ error: "Invalid input" });
  const expense = await Expense.create({ title, amount, category, date });
  res.json(expense);
});

app.listen(process.env.PORT || 5000, () => console.log("Server running"));
