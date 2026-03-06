import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { befeProfiles, befeAnswers, questions } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { TestClient } from "./test-client";

export default async function TestPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // layout에서 auth + profile 체크 완료, 여기서는 데이터 조회만
  const [profile] = await db
    .select()
    .from(befeProfiles)
    .where(eq(befeProfiles.user_id, user!.id))
    .limit(1);

  const allQuestions = await db
    .select()
    .from(questions)
    .orderBy(asc(questions.index));

  const existingAnswers = await db
    .select()
    .from(befeAnswers)
    .where(eq(befeAnswers.profile_id, profile.id));

  return (
    <TestClient
      profile={profile}
      questions={allQuestions}
      initialAnswers={existingAnswers}
    />
  );
}
