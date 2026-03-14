import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {

  const { email, password } = await req.json();

  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    return Response.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return Response.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const response = Response.json({
    message: "Login successful"
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return response;
}