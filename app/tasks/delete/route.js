import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import jwt from "jsonwebtoken";

export async function DELETE(req) {

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { taskId } = await req.json();

  await connectDB();

  await Task.deleteOne({
    _id: taskId,
    userId: decoded.id
  });

  return Response.json({ message: "Task deleted" });
}