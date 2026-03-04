import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state") || "/home";

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 1. code → token 교환 (JS key = authorize 시 사용한 client_id)
  const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_REST_API_KEY!,
      redirect_uri: `${request.nextUrl.origin}/auth/callback`,
      client_secret: process.env.KAKAO_CLIENT_SECRET!, // ← 추가

      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.id_token) {
    console.error("Kakao token exchange failed:", tokenData);
    return NextResponse.redirect(new URL("/?error=token_failed", request.url));
  }

  // 2. signInWithIdToken → 쿠키에 세션 자동 저장
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.signInWithIdToken({
    provider: "kakao",
    token: tokenData.id_token,
  });

  if (error) {
    console.error("signInWithIdToken failed:", error);
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }

  return NextResponse.redirect(new URL(state, request.url));
}
