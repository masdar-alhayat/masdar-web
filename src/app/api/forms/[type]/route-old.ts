import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";

const allowed = new Set(["partnership", "careers", "contact"]);
const attempts = new Map<string, {count: number; reset: number}>();
const MAX_FILE = 5 * 1024 * 1024;
const allowedTypes = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"]);

export async function POST(request: NextRequest, {params}: {params: Promise<{type: string}>}) {
  const {type} = await params;
  if (!allowed.has(type)) return NextResponse.json({ok: false, message: "Unknown form"}, {status: 404});
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const now = Date.now();
  const slot = attempts.get(ip);
  if (slot && slot.reset > now && slot.count >= 8) return NextResponse.json({ok: false, message: "Too many requests"}, {status: 429});
  attempts.set(ip, !slot || slot.reset <= now ? {count: 1, reset: now + 60_000} : {count: slot.count + 1, reset: slot.reset});

  const data = await request.formData();
  if (String(data.get("website") || "")) return NextResponse.json({ok: true});
  const textValues = [...data.entries()].filter(([key, value]) => key !== "website" && typeof value === "string" && value !== "true" && value !== "false").map(([, value]) => String(value));
  const textSchema = z.array(z.string().trim().min(1).max(5000)).min(2);
  const parsed = textSchema.safeParse(textValues);
  if (!parsed.success || data.get("consent") !== "true") return NextResponse.json({ok: false, message: "Validation failed"}, {status: 400});

  for (const [, value] of data.entries()) {
    if (value instanceof File && value.size) {
      if (value.size > MAX_FILE || !allowedTypes.has(value.type)) return NextResponse.json({ok: false, message: "Invalid attachment"}, {status: 400});
    }
  }

  // Production integration point: forward validated data to approved corporate email/CRM/ATS adapter.
  return NextResponse.json({ok: true, reference: `MAH-${type.toUpperCase()}-${Date.now()}`});
}
