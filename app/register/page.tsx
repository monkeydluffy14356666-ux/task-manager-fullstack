"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
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

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server returned invalid response");
      }

      if (res.ok) {
        setIsError(false);
        setMessage("✅ " + data.message);
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setIsError(true);
        setMessage("❌ " + (data.message || "Something went wrong"));
      }
    } catch (err: any) {
      setIsError(true);
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    boxSizing: "border-box",
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
          width: "320px",
          boxSizing: "border-box",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1e293b" }}>
          Register
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />

        {message && (
          <p style={{
            textAlign: "center",
            fontSize: "13px",
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "5px",
            background: isError ? "#fee2e2" : "#dcfce7",
            color: isError ? "#dc2626" : "#16a34a",
            fontWeight: "500",
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
            background: loading ? "#86a887" : "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            boxSizing: "border-box",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{ textAlign: "center", marginTop: "15px", fontSize: "13px", color: "#555" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#16a34a", fontWeight: "600", textDecoration: "none" }}>
            Login
          </a>
        </p>
      </form>
    </div>
  );
}