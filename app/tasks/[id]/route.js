import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

async function authorize(req, id) {
  const token = getTokenFromRequest(req);
  const decoded = verifyToken(token);
  if (!decoded) return { error: "Unauthorized", status: 401 };

  await connectDB();
  const task = await Task.findById(id);
  if (!task) return { error: "Task not found", status: 404 };
  if (task.userId.toString() !== decoded.userId) return { error: "Forbidden", status: 403 };

  return { task, decoded };
}

export async function GET(req, { params }) {
  const result = await authorize(req, params.id);
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ task: result.task });
}

export async function PUT(req, { params }) {
  const result = await authorize(req, params.id);
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });

  const { title, description, status } = await req.json();
  const updated = await Task.findByIdAndUpdate(
    params.id,
    { title, description, status },
    { new: true, runValidators: true }
  );
  return NextResponse.json({ task: updated });
}

export async function DELETE(req, { params }) {
  const result = await authorize(req, params.id);
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });

  await Task.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Task deleted" });
}