import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import jwt from "jsonwebtoken";

export async function GET(req) {

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  await connectDB();

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const status = searchParams.get("status");
  const search = searchParams.get("search");

  let query = { userId: decoded.id };

  if (status) query.status = status;

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const tasks = await Task.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  return Response.json(tasks);
}