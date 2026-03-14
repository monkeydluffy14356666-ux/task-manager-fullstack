import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import jwt from "jsonwebtoken";

export async function POST(req) {

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { title, description } = await req.json();

  await connectDB();

  const task = await Task.create({
    userId: decoded.id,
    title,
    description
  });

  return Response.json(task);
}