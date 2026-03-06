import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { befeProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TestIntroClient } from "./intro-client";

export default async function TestIntroPage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/");
  }

  const [profile] = await db
    .select({ id: befeProfiles.id, test_completed: befeProfiles.test_completed })
    .from(befeProfiles)
    .where(eq(befeProfiles.user_id, user.id))
    .limit(1);

  if (!profile) {
    redirect("/profile/create");
  }

  // 이미 테스트 완료면 홈으로
  if (profile.test_completed) {
    redirect("/home");
  }

  return <TestIntroClient />;
}
