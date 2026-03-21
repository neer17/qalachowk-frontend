import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // Safe to ignore in App Router if middleware verifies user sessions.
            }
          },
        },
      },
    );

    // Exchanges the Google Auth code for a valid session,
    // automatically storing it securely in Next.js Server Cookies
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Supabase OAuth Code Exchange Error:", error);
      return NextResponse.redirect(`${origin}/?error=auth-callback-failed`);
    }
  }

  // URL to securely redirect to after the sign-in process completes
  return NextResponse.redirect(`${origin}/`);
}
