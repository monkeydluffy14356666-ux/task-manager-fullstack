"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login(){

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async (e:any)=>{

    e.preventDefault();

    const res = await fetch("/api/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if(res.ok){
      alert("Login Success");
      router.push("/dashboard");
    }else{
      alert(data.message);
    }

  };

  return(
    <div style={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#0f172a"
    }}>

      <form
        onSubmit={handleSubmit}
        style={{
          background:"#fff",
          padding:"30px",
          borderRadius:"10px",
          width:"320px",
          display:"flex",
          flexDirection:"column",
          gap:"10px"
        }}
      >

        <h2 style={{textAlign:"center"}}>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{
            background:"#2563eb",
            color:"#fff",
            border:"none",
            padding:"10px",
            borderRadius:"5px"
          }}
        >
          Login
        </button>

      </form>

    </div>
  );
}