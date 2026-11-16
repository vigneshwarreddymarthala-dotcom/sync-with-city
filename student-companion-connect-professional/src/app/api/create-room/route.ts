import { NextResponse, NextRequest } from "next/server";

const DAILY_API_KEY = process.env.NEXT_DAILY_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({ properties: { enable_chat: true } }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
