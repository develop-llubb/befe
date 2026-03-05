import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get("name") || "배우자";

    const fontData = await fetch(
      new URL(
        "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-700-normal.woff",
      ),
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(160deg, #2C2420 0%, #1A1614 100%)",
            padding: "40px 60px",
            fontFamily: '"Noto Sans KR"',
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 배경 장식 원 */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: -40,
              right: -40,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(212,115,92,0.08)",
            }}
          />
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: -60,
              left: -30,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "rgba(212,115,92,0.06)",
            }}
          />

          {/* 배지 */}
          <div
            style={{
              display: "flex",
              background: "rgba(212,115,92,0.2)",
              borderRadius: 24,
              padding: "8px 20px",
              fontSize: 18,
              color: "#E8927C",
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            {name}님이 초대했어요
          </div>

          {/* 메인 카피 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 44,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.3,
              letterSpacing: -1.5,
              marginBottom: 16,
            }}
          >
            <span>우리 부부 육아 점수,</span>
            <span>몇 점일까?</span>
          </div>

          {/* 서브 카피 */}
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.5,
              marginBottom: 32,
            }}
          >
            3분 심리 검사로 알아보는 부부 육아 케미
          </div>

          {/* CTA 버튼 */}
          <div
            style={{
              display: "flex",
              background: "linear-gradient(135deg, #D4735C, #C0614A)",
              borderRadius: 20,
              padding: "14px 36px",
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
              boxShadow: "0 6px 20px rgba(212,115,92,0.35)",
            }}
          >
            함께 검사하기 →
          </div>
        </div>
      ),
      {
        width: 800,
        height: 400,
        fonts: [
          {
            name: "Noto Sans KR",
            data: fontData,
            weight: 700 as const,
            style: "normal" as const,
          },
        ],
      },
    );
  } catch (e) {
    console.error("OG image generation failed:", e);
    return new NextResponse("OG image generation failed", { status: 500 });
  }
}
