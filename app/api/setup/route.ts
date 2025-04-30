import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

// This is a one-time setup endpoint to create the admin user
// It should be disabled or protected in production
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if the email exists in the admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single()

    if (adminError) {
      return NextResponse.json({ error: "Unauthorized. Email not in admin list." }, { status: 401 })
    }

    // Create the user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Admin user created successfully",
      user: data.user,
    })
  } catch (error: any) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}
