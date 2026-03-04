import type { BefeProfile, Question } from "@/db/schema";

/**
 * 질문/답변을 집계해 befe_profiles에 저장할 통계와 Z-score를 계산하여 반환합니다.
 * 순수 함수로 동작하며, DB 접근을 하지 않습니다.
 *
 * - passion_index/level/type 계산은 befe_profiles에 해당 컬럼이 없으므로 제외.
 */
export function calculateProfileScores({
  questions,
  answers,
}: {
  questions: Question[];
  answers: { question_id: string; answer: number }[];
}) {
  // 0) 기준값(평균/표준편차) 상수
  // Adult Attachment (1~7)
  const ECR = {
    avoid: { mean: 3.1, sd: 0.9 },
    anx: { mean: 3.5, sd: 1.1 },
  };

  // flexibility (1~7) — Cann, 2008 예시
  const STAB = {
    humor: { mean: 5.56, sd: 0.91 },
    conflict: { mean: 5.54, sd: 0.95 },
  };

  // BIG5 (1~5)
  const BIG5 = {
    openness: { mean: 2.66, sd: 0.4 },
    conscientiousness: { mean: 3.91, sd: 0.32 },
    extraversion: { mean: 3.14, sd: 0.38 },
    agreeableness: { mean: 3.91, sd: 0.32 },
    neuroticism: { mean: 2.35, sd: 0.47 },
  };

  const byTest: Record<string, Record<string, number[]>> = {};

  for (const a of answers) {
    const q = questions.find((q) => q.id === a.question_id);
    if (!q) continue;

    const test = q.test_id;
    const domain = q.domain;

    byTest[test] ||= {};
    byTest[test][domain] ||= [];
    byTest[test][domain].push(Number(a.answer));
  }

  const mean = (arr?: number[]) =>
    arr && arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : undefined;

  const z = (x: number | undefined, m: number, s: number) =>
    x == null || s === 0 ? undefined : (x - m) / s;

  // 2) 도메인 평균 계산
  const avgAvoid = mean(byTest["adult-attachment"]?.["Avoidance"]);
  const avgAnx = mean(byTest["adult-attachment"]?.["Anxiety"]);

  const avgHumor = mean(byTest["flexibility"]?.["Humor"]);
  const avgConflict = mean(byTest["flexibility"]?.["Conflict"]);

  const avgOpen = mean(byTest["big-5"]?.["Openness"]);
  const avgCons = mean(byTest["big-5"]?.["Conscientiousness"]);
  const avgExtra = mean(byTest["big-5"]?.["Extraversion"]);
  const avgAgree = mean(byTest["big-5"]?.["Agreeableness"]);
  const avgNeuro = mean(byTest["big-5"]?.["Neuroticism"]);

  // 3) Z-score 계산
  const zAvoid =
    avgAvoid == null ? undefined : z(avgAvoid, ECR.avoid.mean, ECR.avoid.sd);
  const zAnx =
    avgAnx == null ? undefined : z(avgAnx, ECR.anx.mean, ECR.anx.sd);

  const zHumor =
    avgHumor == null ? undefined : z(avgHumor, STAB.humor.mean, STAB.humor.sd);
  const zConflict =
    avgConflict == null
      ? undefined
      : z(avgConflict, STAB.conflict.mean, STAB.conflict.sd);

  const zOpen =
    avgOpen == null
      ? undefined
      : z(avgOpen, BIG5.openness.mean, BIG5.openness.sd);
  const zCons =
    avgCons == null
      ? undefined
      : z(avgCons, BIG5.conscientiousness.mean, BIG5.conscientiousness.sd);
  const zExtra =
    avgExtra == null
      ? undefined
      : z(avgExtra, BIG5.extraversion.mean, BIG5.extraversion.sd);
  const zAgree =
    avgAgree == null
      ? undefined
      : z(avgAgree, BIG5.agreeableness.mean, BIG5.agreeableness.sd);
  const zNeuro =
    avgNeuro == null
      ? undefined
      : z(avgNeuro, BIG5.neuroticism.mean, BIG5.neuroticism.sd);

  // Flexibility Percentage Calculation
  const zflexibility =
    zHumor == null || zConflict == null
      ? undefined
      : 0.6 * zHumor + 0.4 * zConflict;

  let flexibilityPercentage: number | undefined;
  let flexibilityLevel: number | undefined;
  if (zflexibility != null) {
    const rawMin = 1;
    const rawMax = 7;
    const zHumorMin = (rawMin - STAB.humor.mean) / STAB.humor.sd;
    const zHumorMax = (rawMax - STAB.humor.mean) / STAB.humor.sd;
    const zConflictMin = (rawMin - STAB.conflict.mean) / STAB.conflict.sd;
    const zConflictMax = (rawMax - STAB.conflict.mean) / STAB.conflict.sd;
    const zflexibilityMin = 0.6 * zHumorMin + 0.4 * zConflictMin;
    const zflexibilityMax = 0.6 * zHumorMax + 0.4 * zConflictMax;
    const percentage =
      ((zflexibility - zflexibilityMin) / (zflexibilityMax - zflexibilityMin)) *
      100;
    flexibilityPercentage = Math.max(0, Math.min(100, percentage));
    if (flexibilityPercentage < 20) flexibilityLevel = 1;
    else if (flexibilityPercentage < 40) flexibilityLevel = 2;
    else if (flexibilityPercentage < 60) flexibilityLevel = 3;
    else if (flexibilityPercentage < 80) flexibilityLevel = 4;
    else flexibilityLevel = 5;
  }

  // Attachment type & intensity
  let aasIntensity: number | undefined;
  let attachmentType: string | undefined;

  if (zAnx != null && zAvoid != null) {
    const R = Math.sqrt(zAnx * zAnx + zAvoid * zAvoid);
    if (R < 0.9) aasIntensity = 1;
    else if (R < 1.8) aasIntensity = 2;
    else if (R < 2.7) aasIntensity = 3;
    else if (R < 3.6) aasIntensity = 4;
    else aasIntensity = 5;

    const isHighAnx = zAnx >= 0;
    const isHighAvoid = zAvoid >= 0;
    if (!isHighAnx && !isHighAvoid) attachmentType = "secure";
    else if (isHighAnx && !isHighAvoid) attachmentType = "anxious";
    else if (!isHighAnx && isHighAvoid) attachmentType = "avoidant";
    else attachmentType = "disorganized";
  }

  // Big 5 Type Calculation
  let big5Type: number | undefined;
  if (
    avgExtra != null &&
    avgAgree != null &&
    avgCons != null &&
    avgNeuro != null &&
    avgOpen != null
  ) {
    const rE = Math.round(avgExtra);
    const rA = Math.round(avgAgree);
    const rC = Math.round(avgCons);
    const rN = Math.round(avgNeuro);
    const rO = Math.round(avgOpen);
    const clamp = (n: number) => Math.max(1, Math.min(5, n));
    big5Type =
      (clamp(rE) - 1) * 625 +
      (clamp(rA) - 1) * 125 +
      (clamp(rC) - 1) * 25 +
      (clamp(rN) - 1) * 5 +
      (clamp(rO) - 1) +
      1;
  }

  // 4) 업데이트 payload 구성 (passion 관련 필드 제외)
  const patch: Partial<BefeProfile> = {
    ...(avgAvoid != null ? { avoidance: avgAvoid } : {}),
    ...(avgAnx != null ? { anxiety: avgAnx } : {}),
    ...(avgHumor != null ? { humor: avgHumor } : {}),
    ...(avgConflict != null ? { conflict: avgConflict } : {}),
    ...(avgOpen != null ? { openness: avgOpen } : {}),
    ...(avgCons != null ? { conscientiousness: avgCons } : {}),
    ...(avgExtra != null ? { extraversion: avgExtra } : {}),
    ...(avgAgree != null ? { agreeableness: avgAgree } : {}),
    ...(avgNeuro != null ? { neuroticism: avgNeuro } : {}),

    ...(zAvoid != null ? { z_avoidance: zAvoid } : {}),
    ...(zAnx != null ? { z_anxiety: zAnx } : {}),
    ...(zHumor != null ? { z_humor: zHumor } : {}),
    ...(zConflict != null ? { z_conflict: zConflict } : {}),
    ...(zOpen != null ? { z_openness: zOpen } : {}),
    ...(zCons != null ? { z_conscientiousness: zCons } : {}),
    ...(zExtra != null ? { z_extraversion: zExtra } : {}),
    ...(zAgree != null ? { z_agreeableness: zAgree } : {}),
    ...(zNeuro != null ? { z_neuroticism: zNeuro } : {}),

    ...(avgAvoid != null &&
    avgAnx != null &&
    avgHumor != null &&
    avgConflict != null &&
    avgOpen != null &&
    avgCons != null &&
    avgExtra != null &&
    avgAgree != null &&
    avgNeuro != null
      ? { test_completed: true }
      : {}),
    ...(big5Type != null ? { big_5_type: big5Type } : {}),
    ...(aasIntensity != null ? { aas_intensity: aasIntensity } : {}),
    ...(attachmentType != null
      ? { attachment_type: attachmentType as BefeProfile["attachment_type"] }
      : {}),
    ...(flexibilityPercentage != null
      ? { flexibility_percentage: flexibilityPercentage }
      : {}),
    ...(flexibilityLevel != null
      ? { flexibility_level: flexibilityLevel }
      : {}),
    updated_at: new Date().toISOString(),
  };

  return { patch };
}
