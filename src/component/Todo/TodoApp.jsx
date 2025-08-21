import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

function TodoApp() {
  // Load once during initialization (prevents overwriting with [])
  const [tasks, setTasks] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("tasks");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [filter, setFilter] = useState("all"); // all | done | todo

  // Persist whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks:", e);
    }
  }, [tasks]);

  const addTask = () => {
    const text = input.trim();
    if (!text) return;

    if (isEditing) {
      setTasks((prev) =>
        prev.map((todo) => (todo.id === currentId ? { ...todo, text } : todo))
      );
      setIsEditing(false);
      setCurrentId(null);
    } else {
      setTasks((prev) => [...prev, { id: Date.now(), text, completed: false }]);
    }
    setInput("");
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((todo) => todo.id !== id));
    if (currentId === id) {
      setIsEditing(false);
      setCurrentId(null);
      setInput("");
    }
  };

  const editTask = (id, text) => {
    setIsEditing(true);
    setCurrentId(id);
    setInput(text);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteCompleted = () => {
    setTasks((prev) => prev.filter((todo) => !todo.completed));
  };

  const deleteAll = () => setTasks([]);

  const filteredTasks = tasks.filter((todo) => {
    if (filter === "done") return todo.completed;
    if (filter === "todo") return !todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        {/* Input */}
        <h2 className="text-xl font-semibold text-center mb-4">Todo App</h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New Todo"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={addTask}
            className="bg-cyan-600 text-white px-5 py-2 rounded-lg hover:bg-cyan-700 transition cursor-pointer"
          >
            {isEditing ? "Update task" : "Add new task"}
          </button>
        </div>

        {/* Filters */}
        <h2 className="text-xl font-semibold text-center mb-4">Todo List</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-md ${
              filter === "all"
                ? "bg-cyan-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("done")}
            className={`px-6 py-2 rounded-md ${
              filter === "done"
                ? "bg-cyan-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Done
          </button>
          <button
            onClick={() => setFilter("todo")}
            className={`px-6 py-2 rounded-md ${
              filter === "todo"
                ? "bg-cyan-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Todo
          </button>
        </div>

        {/* List */}
        <ul className="space-y-3">
          {filteredTasks.length === 0 && (
            <p className="text-gray-500 text-center">No tasks found</p>
          )}
          {filteredTasks.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!todo.completed}
                  onChange={() => toggleTask(todo.id)}
                  className="h-5 w-5 text-cyan-600 rounded"
                />
                <span
                  className={`${
                    todo.completed
                      ? "line-through text-red-500"
                      : "text-gray-800"
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <div className="flex items-center gap-3 text-lg">
                <button
                  onClick={() => editTask(todo.id, todo.text)}
                  className="text-blue-500 hover:text-yellow-700 cursor-pointer"
                  title="Edit"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => deleteTask(todo.id)}
                  className="text-red-600 hover:text-red-700 cursor-pointer"
                  title="Delete"
                >
                  <MdDelete />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Bulk actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <button
            onClick={deleteCompleted}
            disabled={!tasks.some((todo) => todo.completed)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:bg-gray-300 cursor-pointer"
          >
            Delete done tasks
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-300 cursor-pointer"
            onClick={deleteAll}
            disabled={tasks.length === 0}
          >
            Delete all tasks
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
