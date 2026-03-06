import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
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
            background: "linear-gradient(160deg, #FEFCF9 0%, #FFF6F2 100%)",
            fontFamily: '"Noto Sans KR"',
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient orbs */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: -60,
              right: -60,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,216,190,0.5) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: -40,
              left: -40,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(200,184,232,0.25) 0%, transparent 70%)",
            }}
          />

          {/* Collab logos: BeFe x Chemistry */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                background: "#3A3A3A",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: 1,
              }}
            >
              BeFe
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                color: "#B8A898",
              }}
            >
              x
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 700,
                color: "#B8A898",
              }}
            >
              Chemistry
            </div>
          </div>

          {/* Brand name */}
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 700,
              color: "#D4735C",
              letterSpacing: 4,
              lineHeight: 1,
            }}
          >
            아이케미
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              fontSize: 14,
              fontWeight: 700,
              color: "#B8A898",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            Parenting Chemistry
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 700,
              color: "#6B6360",
              marginTop: 28,
              lineHeight: 1.5,
            }}
          >
            심리학 기반 부부 육아 케어 리포트
          </div>

          {/* Indicator pills */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 24,
            }}
          >
            {[
              { code: "ESB", label: "마음여유", color: "#7BA872", bg: "#F0F7F0" },
              { code: "CSP", label: "서로돕기", color: "#D4735C", bg: "#FFF0EB" },
              { code: "PCI", label: "규칙일관", color: "#5B9BD5", bg: "#EEF4FB" },
              { code: "STB", label: "스트레스차단", color: "#8B72BE", bg: "#F3EFF9" },
            ].map((pill) => (
              <div
                key={pill.code}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#fff",
                  border: `1px solid ${pill.color}22`,
                  borderRadius: 12,
                  padding: "6px 12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: pill.bg,
                    fontSize: 9,
                    fontWeight: 700,
                    color: pill.color,
                  }}
                >
                  {pill.code}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#3A3A3A",
                  }}
                >
                  {pill.label}
                </span>
              </div>
            ))}
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
