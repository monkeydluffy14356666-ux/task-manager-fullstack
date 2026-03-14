import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGO_URI);
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      message: "User created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}