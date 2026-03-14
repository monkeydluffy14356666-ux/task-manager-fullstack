"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // ✅ Replace alert()
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ " + data.message);
        setTimeout(() => router.push("/login"), 1500); // ✅ Redirect after showing message
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      setMessage("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    boxSizing: "border-box", // ✅ Fix #1: prevents overflow blocking the button
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #0f172a, #334155)",
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          width: "300px",
          boxSizing: "border-box", // ✅ Fix #1 on container too
          overflow: "hidden",      // ✅ Safety net
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>

        <input type="text" placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)} style={inputStyle} required />

        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />

        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />

        {/* ✅ Fix #2: Inline message instead of alert() */}
        {message && (
          <p style={{
            textAlign: "center",
            fontSize: "13px",
            marginBottom: "10px",
            color: message.startsWith("✅") ? "green" : "red",
          }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: loading ? "#aaa" : "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            boxSizing: "border-box",
            fontSize: "15px",
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}