import { useState, useEffect } from 'react'
import './App.css'

// ==========================================
// 1. TODO COMPONENT
// ==========================================
function TodoApp({ selectedDate }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = async () => {
    // Uses the date passed from the Boss (App)
    const response = await fetch(`http://localhost:5151/api/todo?date=${selectedDate}`);
    const data = await response.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (!newTask) return;

    await fetch("http://localhost:5151/api/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Title: newTask,         // Match C# Property Name
        IsCompleted: false,     // Match C# Property Name
        Date: selectedDate      // Add the date!
      }),
    });
    setNewTask("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5151/api/todo/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await fetch(`http://localhost:5151/api/todo/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, isCompleted: !task.isCompleted }),
    });
    fetchTasks();
  };

  // Refresh tasks whenever the selectedDate changes
  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  return (
    <div>
      <h2>Tasks for {selectedDate}</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <button className="add-btn" onClick={addTask}>Add Task</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} className="list-item">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleComplete(task)}
            />
            <span className="list-item-text">{task.title}</span>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ==========================================
// 2. EXPENSE COMPONENT
// ==========================================
function ExpenseTracker({ selectedDate }) {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const fetchExpenses = async () => {
    const response = await fetch(`http://localhost:5151/api/expenses?date=${selectedDate}`);
    const data = await response.json();
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedDate]);

  const addExpense = async () => {
    if (!expenseName || !expenseAmount) return;
    console.log("Adding expense: 1.", expenseAmount); // Debugging line
    await fetch("http://localhost:5151/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // IMPORTANT: We send the selectedDate to the database here!
      body: JSON.stringify({
        name: expenseName,
        amount: parseFloat(expenseAmount),
        date: selectedDate
      }),
    });
        console.log("Adding expense: 2.", expenseAmount); // Debugging line

    setExpenseName("");
    setExpenseAmount("");
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await fetch(`http://localhost:5151/api/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  };

  const startEditing = (expense) => {
    setEditingId(expense.id);
    setEditName(expense.name);
    setEditAmount(expense.amount);
  };

  const saveEdit = async (id) => {
    const updatedExpense = {
      id: id,
      name: editName,
      amount: parseFloat(editAmount),
      date: selectedDate // Keep it on the same day
    };
    await fetch(`http://localhost:5151/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedExpense),
    });
    setEditingId(null);
    fetchExpenses();
  };
  // This calculates the total sum of all expenses currently on the screen
  const totalExpenses = expenses.reduce((sum, currentExpense) => {
    return sum + currentExpense.amount;
  }, 0); // The '0' is the starting size of our snowball

  return (
    <div>
      <h2>Expenses for {selectedDate}</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Item name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
        />
        <button className="add-btn" onClick={addExpense}>Add Expense</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {expenses.map((expense) => (
          <li key={expense.id} className="list-item">
            {editingId === expense.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ flex: 1, marginRight: "10px" }}
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  style={{ flex: 0.5, marginRight: "10px" }}
                />
                <button className="save-btn" onClick={() => saveEdit(expense.id)}>Save</button>
                <button className="cancel-btn" onClick={() => setEditingId(null)} style={{ marginLeft: "5px" }}>Cancel</button>
              </>
            ) : (
              <>
                <span className="list-item-text"><strong>{expense.name}</strong> — ${expense.amount.toFixed(2)}</span>
                <button className="edit-btn" onClick={() => startEditing(expense)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteExpense(expense.id)} style={{ marginLeft: "5px" }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="total-spent">
        Total Spent: <span>${totalExpenses.toFixed(2)}</span>
      </div>
    </div>
  );
}

// ==========================================
// 3. THE MAIN APP (The Boss)
// ==========================================
export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState("expenses");

  return (
    <div className="app-container">
      
      {/* HEADER: Calendar and Tabs go here */}
      <div className="app-header">
        <h2>🗓️ Daily Planner</h2>

        <div className="date-input-container">
          <strong>Select Date:</strong>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="tab-buttons">
          <button
            onClick={() => setActiveTab("expenses")}
            className="tab-btn"
            style={{
              background: activeTab === "expenses" ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.1)",
              borderColor: activeTab === "expenses" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)"
            }}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab("todos")}
            className="tab-btn"
            style={{
              background: activeTab === "todos" ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.1)",
              borderColor: activeTab === "todos" ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.3)"
            }}
          >
            To-Do List
          </button>
        </div>
      </div>

      {/* CONTENT: Expenses and Todo Components live here */}
      <div className="app-content">
        {activeTab === "expenses" ? (
          <ExpenseTracker selectedDate={selectedDate} />
        ) : (
          <TodoApp selectedDate={selectedDate} />
        )}
      </div>

    </div>
  );
}