"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      router.push("/login");
    } else {
      alert(data.message);
    }
  };

  // ✅ Reusable style with box-sizing fix
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    boxSizing: "border-box", // ✅ KEY FIX — prevents overflow
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #334155)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          width: "300px",
          boxSizing: "border-box", // ✅ Also fix the form container
        }}
      >
        <h2 style={{ textAlign: "center" }}>Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "green",
            color: "white",
            border: "none",
            cursor: "pointer",        // ✅ Shows pointer on hover
            borderRadius: "5px",
            boxSizing: "border-box",  // ✅ Consistent sizing
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}