"use client";

import { useEffect,useState } from "react";

export default function Dashboard(){

  const [tasks,setTasks] = useState<any[]>([]);
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");

  const fetchTasks = async ()=>{

    const res = await fetch("/api/tasks/list");
    const data = await res.json();

    setTasks(data);

  };

  const createTask = async ()=>{

    await fetch("/api/tasks/create",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({title,description})
    });

    setTitle("");
    setDescription("");

    fetchTasks();

  };

  const deleteTask = async (id:string)=>{

    await fetch("/api/tasks/delete",{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({taskId:id})
    });

    fetchTasks();

  };

  useEffect(()=>{
    fetchTasks();
  },[]);

  return(

    <div className="min-h-screen bg-slate-900 p-10">

      <h1 className="text-3xl text-white mb-8">
        Task Dashboard
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-md mb-10">

        <h3 className="text-xl font-semibold mb-4 text-black">
          Create Task
        </h3>

        <input
          className="w-full border border-gray-300 p-2 mb-3 rounded text-black"
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          className="w-full border border-gray-300 p-2 mb-4 rounded text-black"
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <button
          onClick={createTask}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Create Task
        </button>

      </div>

      <h2 className="text-white text-xl mb-4">
        Your Tasks
      </h2>

      <div className="grid gap-4 max-w-md">

        {tasks.map(task=>(

          <div
            key={task._id}
            className="bg-white p-4 rounded shadow"
          >

            <h3 className="font-bold text-black">
              {task.title}
            </h3>

            <p className="text-gray-700 mb-3">
              {task.description}
            </p>

            <button
              onClick={()=>deleteTask(task._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}