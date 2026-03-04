"use server";

import { db } from "@/db";
import { befeAnswers, befeProfiles } from "@/db/schema";
import type { BefeProfile } from "@/db/schema";
import { eq, and, lt } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
