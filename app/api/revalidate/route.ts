import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

// POST /api/revalidate?secret=<REVALIDATION_SECRET>
// Call this endpoint to force-refresh all portfolio pages without redeploying.
// Set REVALIDATION_SECRET in your environment variables (Vercel dashboard + .env.local).
// You can also wire this up as a Supabase Database Webhook to auto-trigger on data changes.
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret")

  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid or missing secret" }, { status: 401 })
  }

  revalidatePath("/", "layout")

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
