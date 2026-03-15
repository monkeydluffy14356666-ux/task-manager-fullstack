"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_OPTIONS = ["all", "pending", "in-progress", "completed"];
const statusColor: Record<string, string> = {
  pending: "#f59e0b",
  "in-progress": "#3b82f6",
  completed: "#22c55e",
};

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: "", description: "", status: "pending" });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        status,
        search,
      });
      const res = await fetch(`/api/tasks?${params}`);
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [page, status, search, router]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const openCreate = () => {
    setEditTask(null);
    setForm({ title: "", description: "", status: "pending" });
    setShowModal(true);
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setForm({ title: task.title, description: task.description, status: task.status });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    try {
      const url = editTask ? `/api/tasks/${editTask._id}` : "/api/tasks";
      const method = editTask ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editTask ? "Task updated!" : "Task created!");
      setShowModal(false);
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Task deleted");
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1a1a2e", color: "#fff", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>📋 Task Manager</h1>
        <button onClick={handleLogout} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
        {/* Controls */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ flex: 1, padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #ddd", minWidth: "200px" }}
          />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #ddd" }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button onClick={openCreate} style={{ background: "#22c55e", color: "#fff", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
            + New Task
          </button>
        </div>

        {/* Task List */}
        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#888" }}>
            <p style={{ fontSize: "3rem" }}>📭</p>
            <p>No tasks found. Create one!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} style={{ background: "#fff", borderRadius: "10px", padding: "1.2rem 1.5rem", marginBottom: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 0.3rem" }}>{task.title}</h3>
                <p style={{ margin: "0 0 0.5rem", color: "#666", fontSize: "0.9rem" }}>{task.description}</p>
                <span style={{ background: statusColor[task.status], color: "#fff", padding: "0.2rem 0.7rem", borderRadius: "999px", fontSize: "0.8rem" }}>
                  {task.status}
                </span>
                <span style={{ marginLeft: "1rem", color: "#aaa", fontSize: "0.8rem" }}>
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => openEdit(task)} style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "0.4rem 0.9rem", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
                <button onClick={() => handleDelete(task._id)} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "0.4rem 0.9rem", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                style={{ padding: "0.4rem 0.9rem", borderRadius: "6px", border: "1px solid #ddd", background: p === page ? "#1a1a2e" : "#fff", color: p === page ? "#fff" : "#333", cursor: "pointer" }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "2rem", width: "100%", maxWidth: "440px" }}>
            <h2 style={{ marginTop: 0 }}>{editTask ? "Edit Task" : "New Task"}</h2>
            <input
              placeholder="Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "1rem", boxSizing: "border-box" }}
            />
            <textarea
              placeholder="Description"
              value={form.description}
              rows={3}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "1rem", boxSizing: "border-box" }}
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{ width: "100%", padding: "0.7rem", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "1.5rem" }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "0.7rem", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} style={{ flex: 1, padding: "0.7rem", borderRadius: "8px", background: "#22c55e", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                {editTask ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
