import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "User created successfully",
      user: {
        name,
        email
      }
    });

  } catch (error) {

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );

  }
}