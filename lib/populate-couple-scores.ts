import { db } from "@/db";
import { befeCouples, befeProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nz } from "./utils";
import {
  calculatePNCAmScores,
  type ProfileScores,
} from "./pncam-calculator";

export async function populateCoupleScores(
  coupleId: string,
): Promise<void> {
  // 1) couple 조회
  const [couple] = await db
    .select({
      id: befeCouples.id,
      inviter_profile_id: befeCouples.inviter_profile_id,
      invitee_profile_id: befeCouples.invitee_profile_id,
      pcq_score: befeCouples.pcq_score,
    })
    .from(befeCouples)
    .where(eq(befeCouples.id, coupleId))
    .limit(1);

  if (!couple) return;

  // 2) 이미 계산됨
  if (couple.pcq_score !== null) return;

  // 3) 두 프로필 조회
  const [inviter] = await db
    .select()
    .from(befeProfiles)
    .where(eq(befeProfiles.id, couple.inviter_profile_id))
    .limit(1);

  const [invitee] = await db
    .select()
    .from(befeProfiles)
    .where(eq(befeProfiles.id, couple.invitee_profile_id))
    .limit(1);

  if (!inviter || !invitee) return;

  // 4) 양쪽 테스트 완료 확인
  if (!inviter.test_completed || !invitee.test_completed) return;

  // 5) ProfileScores 구성
  function toProfileScores(p: typeof inviter): ProfileScores {
    return {
      role: p.role,
      z_anxiety: nz(p.z_anxiety, "z_anxiety"),
      z_avoidance: nz(p.z_avoidance, "z_avoidance"),
      z_openness: nz(p.z_openness, "z_openness"),
      z_conscientiousness: nz(p.z_conscientiousness, "z_conscientiousness"),
      z_extraversion: nz(p.z_extraversion, "z_extraversion"),
      z_agreeableness: nz(p.z_agreeableness, "z_agreeableness"),
      z_neuroticism: nz(p.z_neuroticism, "z_neuroticism"),
      z_conflict: nz(p.z_conflict, "z_conflict"),
      z_humor: nz(p.z_humor, "z_humor"),
    };
  }

  const result = calculatePNCAmScores(
    toProfileScores(inviter),
    toProfileScores(invitee),
  );

  // 6) couple 업데이트
  await db
    .update(befeCouples)
    .set({
      e_llubb: result.e_llubb,
      l_llubb: result.l_llubb,
      esb_score: result.esb_score,
      csp_score: result.csp_score,
      pci_score: result.pci_score,
      stb_score: result.stb_score,
      esb_grade: result.esb_grade,
      csp_grade: result.csp_grade,
      pci_grade: result.pci_grade,
      stb_grade: result.stb_grade,
      pcq_score: result.pcq_score,
      updated_at: new Date().toISOString(),
    })
    .where(eq(befeCouples.id, coupleId));
}
