"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { BefeProfile } from "@/db/schema";

// ── Test Complete Page ──

function CompletePage({
  onViewCareReport,
  onGoHome,
}: {
  onViewCareReport: () => void;
  onGoHome: () => void;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setTimeout(() => setReady(true), 100);
  }, []);

  const ease = (delay = 0): React.CSSProperties => ({
    opacity: ready ? 1 : 0,
    transform: ready ? "translateY(0)" : "translateY(16px)",
    transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  return (
    <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col bg-background">
      <div className="flex flex-1 flex-col items-center px-5">
        {/* Success icon */}
        <div className="relative mt-[72px]" style={ease(0)}>
          {/* Ring pulses */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-24 w-24 -mt-12 -ml-12 rounded-full border-2 border-primary"
            style={{
              animation: ready ? "ringPulse 1.5s ease-out 0.3s" : "none",
              opacity: 0,
            }}
          />
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-24 w-24 -mt-12 -ml-12 rounded-full border-2 border-primary"
            style={{
              animation: ready ? "ringPulse 1.5s ease-out 0.6s" : "none",
              opacity: 0,
            }}
          />
          {/* Circle */}
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(145deg, #D4735C, #C0614A)",
              boxShadow: "0 12px 32px rgba(212,115,92,0.25)",
              animation: ready
                ? "confettiBurst 0.5s cubic-bezier(0.22,1,0.36,1)"
                : "none",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 24,
                  strokeDashoffset: 0,
                  animation: ready
                    ? "checkDraw 0.4s ease 0.3s backwards"
                    : "none",
                }}
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="mt-7 text-center text-2xl font-extrabold tracking-[-0.8px] text-foreground"
          style={ease(0.15)}
        >
          검사가 완료되었어요!
        </h1>
        <p
          className="mt-2.5 text-center text-sm leading-[1.7] text-muted"
          style={ease(0.2)}
        >
          응답이 저장되었습니다.
          <br />
          지금 바로 결과를 확인해 보세요.
        </p>

        {/* Two CTA cards */}
        <div className="mt-9 flex w-full flex-col gap-3" style={ease(0.3)}>
          {/* Card 1: 나의 성향 리포트 */}
          <button
            onClick={onGoHome}
            className="flex w-full items-center gap-4 rounded-[20px] border-[1.5px] border-[#ECE8E3] bg-white p-[22px_20px] text-left transition-all duration-150"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
          >
            <div
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl text-2xl"
              style={{
                background: "linear-gradient(145deg, #F3EFF9, #EDE8F5)",
              }}
            >
              🪞
            </div>
            <div className="flex-1">
              <div className="mb-1 text-base font-bold text-foreground">
                나의 성향 리포트
              </div>
              <div className="text-xs leading-[1.5] text-muted">
                Big5, 애착 성향, 정서적 유연성 분석
              </div>
            </div>
            <span className="text-lg text-[#D4CFC8]">→</span>
          </button>

          {/* Card 2: 육아 케어 리포트 */}
          <button
            onClick={onViewCareReport}
            className="flex w-full items-center gap-4 rounded-[20px] border-2 border-primary p-[22px_20px] text-left transition-all duration-150"
            style={{
              background: "linear-gradient(160deg, #FFF6F2, #FFF0EB)",
              boxShadow: "0 4px 16px rgba(212,115,92,0.1)",
            }}
          >
            <div
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl text-2xl"
              style={{
                background: "linear-gradient(145deg, #D4735C, #C0614A)",
              }}
            >
              👶
            </div>
            <div className="flex-1">
              <div className="mb-1 text-base font-bold text-primary">
                육아 케어 리포트
              </div>
              <div className="text-xs leading-[1.5] text-muted">
                부부 육아 점수 · 4대 지표 분석
              </div>
            </div>
            <span className="text-lg text-primary">→</span>
          </button>
        </div>

        {/* Info note */}
        <div
          className="mt-6 w-full rounded-[14px] bg-[#F8F6F3] p-[14px_18px]"
          style={ease(0.4)}
        >
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 text-base">💡</span>
            <p className="text-xs leading-[1.6] text-muted">
              육아 케어 리포트는 배우자와 함께 검사를 완료해야 생성돼요. 아직
              배우자가 검사를 하지 않았다면 초대 링크를 보내보세요.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="shrink-0 px-5 pt-4 pb-8 text-center" style={ease(0.45)}>
        <button
          onClick={onGoHome}
          className="bg-transparent border-none p-2 text-[13px] text-accent cursor-pointer"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

// ── Invite Page ──

function InvitePartnerPage({
  profileId,
  onBack,
}: {
  profileId: string;
  onBack: () => void;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 80);
  }, []);

  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/${profileId}`
      : "";

  const ease = (delay = 0): React.CSSProperties => ({
    opacity: ready ? 1 : 0,
    transform: ready ? "translateY(0)" : "translateY(18px)",
    transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
  });

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [inviteUrl]);

  const handleKakaoShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: "아이케미 - 육아 케어 검사",
          text: "함께 육아 케어 리포트를 확인해봐요!",
          url: inviteUrl,
        })
        .catch(() => {});
    }
  }, [inviteUrl]);

  const steps = [
    { num: "1", done: true, title: "내 검사 완료", desc: null },
    {
      num: "2",
      done: false,
      title: "배우자가 링크를 통해 가입 & 검사 완료",
      desc: null,
    },
    {
      num: "3",
      done: false,
      title: "리포트 유형 선택 및 결제",
      desc: "아이 유무에 따라 리포트 유형을 선택하고 결제를 진행해요.",
    },
    {
      num: "4",
      done: false,
      title: "리포트 확인 & PDF 다운로드",
      desc: "웹에서 바로 확인하고, PDF로 저장할 수도 있어요.",
    },
  ];

  return (
    <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col bg-background">
      {/* Header */}
      <div
        className="flex shrink-0 items-center gap-3 px-5 py-4"
        style={ease(0)}
      >
        <button
          onClick={onBack}
          className="border-none bg-transparent cursor-pointer pr-2 py-1 text-xl text-foreground"
        >
          ←
        </button>
        <span className="text-[15px] font-semibold text-foreground">
          배우자 초대
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5">
        {/* Illustration */}
        <div
          className="mt-8 flex justify-center"
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? "scale(1)" : "scale(0.85)",
            transition: "all 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s",
          }}
        >
          <div
            className="flex h-[110px] w-[110px] items-center justify-center rounded-full text-5xl"
            style={{
              background: "linear-gradient(145deg, #FFE8D6, #FFF0E6)",
              boxShadow: "0 8px 24px rgba(212,115,92,0.08)",
              animation: ready ? "float-pill 3s ease-in-out infinite" : "none",
            }}
          >
            💌
          </div>
        </div>

        <h1
          className="mt-6 text-center text-[22px] font-extrabold leading-[1.4] tracking-[-0.8px] text-foreground"
          style={ease(0.1)}
        >
          배우자에게
          <br />
          초대 링크를 보내주세요
        </h1>
        <p
          className="mt-2 text-center text-[13px] leading-[1.7] text-muted"
          style={ease(0.15)}
        >
          배우자도 검사를 완료하면
          <br />
          부부 육아 케어 리포트가 생성돼요.
        </p>

        {/* Invite link box */}
        <div
          className="mt-7 w-full rounded-2xl border-[1.5px] border-[#ECE8E3] bg-white p-4"
          style={ease(0.2)}
        >
          <div className="mb-2 text-[11px] font-semibold text-muted">
            초대 링크
          </div>
          <div className="rounded-[10px] bg-[#F8F6F3] px-3.5 py-3 font-mono text-xs leading-[1.5] text-[#6B6360] break-all">
            {inviteUrl}
          </div>
          <button
            onClick={handleCopy}
            className={`mt-2.5 h-[42px] w-full rounded-xl border-[1.5px] border-[#ECE8E3] text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
              copied ? "bg-[#F0F7F0] text-[#7BA872]" : "bg-white text-[#6B6360]"
            }`}
          >
            {copied ? "✓ 복사됨" : "링크 복사하기"}
          </button>
        </div>

        {/* Kakao share */}
        <div style={ease(0.25)}>
          <button
            onClick={handleKakaoShare}
            className="mt-3 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border-none bg-[#FEE500] text-[15px] font-semibold text-[#191919] cursor-pointer"
            style={{ boxShadow: "0 4px 16px rgba(254,229,0,0.25)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 0.6C4.029 0.6 0 3.713 0 7.55C0 9.947 1.558 12.055 3.931 13.335L2.933 16.803C2.845 17.108 3.199 17.35 3.465 17.169L7.565 14.455C8.036 14.49 8.515 14.5 9 14.5C13.971 14.5 18 11.387 18 7.55C18 3.713 13.971 0.6 9 0.6Z"
                fill="#191919"
              />
            </svg>
            카카오톡으로 초대하기
          </button>
        </div>

        {/* Steps */}
        <div
          className="mt-7 mb-5 w-full rounded-[18px] border border-border bg-white p-[22px_20px]"
          style={ease(0.3)}
        >
          <div className="mb-[18px] text-sm font-bold text-foreground">
            앞으로 이렇게 진행돼요
          </div>
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex gap-3.5"
              style={{ marginBottom: i < 3 ? 18 : 0 }}
            >
              {/* Step indicator + line */}
              <div className="flex shrink-0 flex-col items-center">
                <div
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full text-[11px] font-bold"
                  style={{
                    background: step.done
                      ? "linear-gradient(135deg, #D4735C, #C0614A)"
                      : "#F0EDE9",
                    color: step.done ? "#fff" : "#B8A898",
                  }}
                >
                  {step.done ? "✓" : step.num}
                </div>
                {i < 3 && (
                  <div
                    className="mt-1 min-h-4 flex-1"
                    style={{
                      width: 1.5,
                      background: step.done ? "#D4735C" : "#ECE8E3",
                    }}
                  />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 pt-0.5">
                <div
                  className="text-[13px] leading-[1.5]"
                  style={{
                    fontWeight: step.done ? 600 : 500,
                    color: step.done ? "#3A3A3A" : "#6B6360",
                  }}
                >
                  {step.title}
                </div>
                {step.desc && (
                  <div className="mt-1 text-[11px] leading-[1.55] text-muted">
                    {step.desc}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Baby fair promo */}
        <div
          className="relative mb-6 w-full overflow-hidden rounded-[18px] p-[22px_20px] text-white"
          style={{
            background: "linear-gradient(160deg, #D4735C, #C0614A)",
            ...ease(0.38),
          }}
        >
          <div className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/[0.08]" />
          <div className="pointer-events-none absolute -bottom-4 -left-4 h-14 w-14 rounded-full bg-white/[0.06]" />
          <div className="relative z-10">
            <div className="mb-3 inline-block rounded-lg bg-white/20 px-2.5 py-1 text-[11px] font-bold">
              🎪 베이비페어 특별 혜택
            </div>
            <div className="mb-2.5 text-base font-extrabold leading-[1.5] tracking-[-0.3px]">
              현장 QR 스캔하면
              <br />
              리포트 무료!
            </div>
            <p className="text-xs leading-[1.7] opacity-85">
              육아 케어 리포트는 유료 서비스이지만, 베이비페어 케미스트리
              부스에서 QR을 스캔하시면 무료로 확인하실 수 있어요.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="shrink-0 px-5 pt-3 pb-8 text-center" style={ease(0.42)}>
        <button
          onClick={() => router.push("/home")}
          className="border-none bg-transparent cursor-pointer p-2 text-[13px] text-accent"
        >
          나중에 할게요
        </button>
      </div>
    </div>
  );
}

// ── Main ──

export function CompleteClient({ profile }: { profile: BefeProfile }) {
  const router = useRouter();
  const [page, setPage] = useState<"complete" | "invite">("complete");

  const handleViewCareReport = useCallback(() => {
    if (profile.invited_by) {
      // 초대받은 사람 → 리포트(홈) 이동
      router.push("/home");
    } else {
      // 초대 안 받은 사람 → 배우자 초대 페이지
      setPage("invite");
    }
  }, [profile.invited_by, router]);

  if (page === "invite") {
    return (
      <InvitePartnerPage
        profileId={profile.id}
        onBack={() => setPage("complete")}
      />
    );
  }

  return (
    <CompletePage
      onViewCareReport={handleViewCareReport}
      onGoHome={() => router.push("/home")}
    />
  );
}
