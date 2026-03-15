import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page  = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query = { userId: decoded.userId };
    if (status && status !== "all") query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      tasks,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = getTokenFromRequest(req);
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { title, description, status } = await req.json();

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const task = await Task.create({
      userId: decoded.userId,
      title,
      description: description || "",
      status: status || "pending",
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}