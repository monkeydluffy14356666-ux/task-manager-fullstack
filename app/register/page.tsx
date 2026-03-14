"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register(){

  const router = useRouter();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleRegister = async () => {

    const res = await fetch("/api/auth/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name,email,password})
    });

    const data = await res.json();

    if(res.ok){
      router.push("/login");
    }else{
      alert(data.message);
    }

  };

  return(

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-slate-900 to-slate-700">

      <div className="bg-white p-8 rounded-xl shadow-xl w-80">

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Register
        </h2>

        <input
          placeholder="Name"
          onChange={(e)=>setName(e.target.value)}
          className="w-full border border-gray-300 p-2 mb-3 rounded text-black focus:ring-2 focus:ring-blue-500"
        />

        <input
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full border border-gray-300 p-2 mb-3 rounded text-black focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 mb-6 rounded text-black focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>

      </div>

    </div>

  );

}