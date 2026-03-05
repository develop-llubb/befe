/**
 * 카카오톡 공유용 OG 이미지 목업
 * 크기: 800 x 400 (카카오 피드형 권장 비율 2:1)
 * 모바일 미리보기에서 잘 보이도록 심플하고 임팩트 있게
 */
export default function KakaoInviteOG({ name = "다은맘" }) {
  return (
    <div
      style={{
        width: 800,
        height: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #2C2420 0%, #1A1614 100%)",
        padding: "40px 60px",
        fontFamily: '"Noto Sans KR", sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 배경 장식 원 */}
      <div
        style={{
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
          background: "rgba(212,115,92,0.2)",
          borderRadius: 24,
          padding: "8px 20px",
          fontSize: 18,
          color: "#E8927C",
          fontWeight: 700,
          marginBottom: 24,
        }}
      >
        💌 {name}님이 초대했어요
      </div>

      {/* 메인 카피 */}
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          color: "#FFFFFF",
          lineHeight: 1.3,
          letterSpacing: -1.5,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        우리 부부 육아 점수,
        <br />
        몇 점일까?
      </div>

      {/* 서브 카피 */}
      <div
        style={{
          fontSize: 18,
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.5,
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        3분 심리 검사로 알아보는 부부 육아 케미
      </div>

      {/* CTA 버튼 */}
      <div
        style={{
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
  );
}
