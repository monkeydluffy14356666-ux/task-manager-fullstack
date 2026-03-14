"use client";

import { useState } from "react";

export default function Dashboard(){

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");

  const createTask = async (e:any)=>{

    e.preventDefault();

    const res = await fetch("/api/tasks/create",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        title,
        description
      })
    });

    const data = await res.json();

    if(res.ok){
      alert("Task Created");
      setTitle("");
      setDescription("");
    }else{
      alert(data.message);
    }

  };

  return(

    <div style={{
      minHeight:"100vh",
      background:"#0f172a",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      padding:"40px"
    }}>

      <h1 style={{color:"#fff"}}>Task Dashboard</h1>

      <form
        onSubmit={createTask}
        style={{
          background:"#fff",
          padding:"20px",
          borderRadius:"10px",
          width:"350px",
          display:"flex",
          flexDirection:"column",
          gap:"10px",
          marginTop:"20px"
        }}
      >

        <input
          placeholder="Task Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{
            background:"#10b981",
            color:"#fff",
            border:"none",
            padding:"10px",
            borderRadius:"5px"
          }}
        >
          Create Task
        </button>

      </form>

    </div>

  );
}