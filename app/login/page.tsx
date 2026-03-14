"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async () => {

    const res = await fetch("/api/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email,password})
    });

    if(res.ok){
      router.push("/dashboard");
    }

  };

  return(

    <div style={{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      height:"100vh",
      background:"#0f172a"
    }}>

      <div style={{
        background:"white",
        padding:"40px",
        borderRadius:"10px",
        width:"320px"
      }}>

        <h2 style={{
          fontSize:"24px",
          marginBottom:"20px",
          color:"black"
        }}>
          Login
        </h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={{
            width:"100%",
            padding:"10px",
            marginBottom:"10px",
            border:"1px solid #ccc",
            color:"black"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{
            width:"100%",
            padding:"10px",
            marginBottom:"20px",
            border:"1px solid #ccc",
            color:"black"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width:"100%",
            padding:"10px",
            background:"#2563eb",
            color:"white",
            border:"none",
            borderRadius:"5px"
          }}
        >
          Login
        </button>

      </div>

    </div>

  );

}