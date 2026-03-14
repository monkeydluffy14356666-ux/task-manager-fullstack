"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {

  const router = useRouter();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async (e:any) => {

    e.preventDefault();

    const res = await fetch("/api/auth/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await res.json();

    if(res.ok){

      alert(data.message);

      router.push("/login");

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
      background:"linear-gradient(135deg,#0f172a,#334155)"
    }}>

      <form
        onSubmit={handleSubmit}
        style={{
          background:"#fff",
          padding:"30px",
          borderRadius:"10px",
          width:"300px"
        }}
      >

        <h2 style={{textAlign:"center"}}>Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          style={{width:"100%",padding:"10px",marginBottom:"10px"}}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={{width:"100%",padding:"10px",marginBottom:"10px"}}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={{width:"100%",padding:"10px",marginBottom:"10px"}}
        />

        <button
          type="submit"
          style={{
            width:"100%",
            padding:"10px",
            background:"green",
            color:"white",
            border:"none"
          }}
        >
          Register
        </button>

      </form>

    </div>

  )

}