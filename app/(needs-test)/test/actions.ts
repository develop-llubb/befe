"use server";

import { db } from "@/db";
import { befeAnswers, befeProfiles, befeCouples } from "@/db/schema";
import type { BefeProfile } from "@/db/schema";
import { eq, and, lt, or } from "drizzle-orm";
import { populateCoupleScores } from "@/lib/populate-couple-scores";

export async function saveAnswer(
  profileId: string,
  questionId: string,
  answer: number,
  nextIndex: number,
) {
  // upsert answer
  await db
    .insert(befeAnswers)
    .values({
      profile_id: profileId,
      question_id: questionId,
      answer,
    })
    .onConflictDoUpdate({
      target: [befeAnswers.profile_id, befeAnswers.question_id],
      set: { answer },
    });

  // test_index를 nextIndex로 업데이트 (현재값보다 클 때만)
  await db
    .update(befeProfiles)
    .set({ test_index: nextIndex })
    .where(
      and(
        eq(befeProfiles.id, profileId),
        lt(befeProfiles.test_index, nextIndex),
      ),
    );
}

export async function completeTest(
  profileId: string,
  patch: Partial<BefeProfile>,
) {
  await db
    .update(befeProfiles)
    .set(patch)
    .where(eq(befeProfiles.id, profileId));

  // couple이 있고 양쪽 다 검사 완료 시 점수 populate
  await tryPopulateCoupleScores(profileId);
}

async function tryPopulateCoupleScores(profileId: string) {
  // couple 조회
  const [couple] = await db
    .select({ id: befeCouples.id, pcq_score: befeCouples.pcq_score })
    .from(befeCouples)
    .where(
      or(
        eq(befeCouples.inviter_profile_id, profileId),
        eq(befeCouples.invitee_profile_id, profileId),
      ),
    )
    .limit(1);

  if (!couple) return;

  // 이미 점수 계산됨
  if (couple.pcq_score !== null) return;

  // populateCoupleScores 내부에서 양쪽 test_completed 확인
  await populateCoupleScores(couple.id);
}

