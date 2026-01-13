import emailjs from "@emailjs/browser";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const {
    name = "",
    email = "",
    message = "",
  } = Object.fromEntries(formData) as {
    name?: string;
    email?: string;
    message?: string;
  };
  console.log("formData", { name, email, message });

  if (name.trim().length <= 1)
    return NextResponse.json(
      { ok: false, error: "Name longer than 1 letter is required." },
      { status: 400 }
    );
  if (!email)
    return NextResponse.json(
      { ok: false, error: "Email is required." },
      { status: 400 }
    );
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json(
      { ok: false, error: "Valid email is required." },
      { status: 400 }
    );
  if (message.trim().length < 2)
    return NextResponse.json(
      { ok: false, error: "Message longer than 2 characters is required." },
      { status: 400 }
    );
  try {
    const res = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      { from_name: name, reply_to: email, message },
      { publicKey: process.env.EMAILJS_PUBLIC_KEY! }
    );

    if (res.status === 200) return NextResponse.json({ ok: true });
    return NextResponse.json(
      { ok: false, error: res.text || "Failed to send" },
      { status: 500 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Send error. Please try again later" },
      { status: 500 }
    );
  }
}
