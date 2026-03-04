import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col bg-background px-6">
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="font-display text-3xl text-primary">아이케미</h1>
        <p className="mt-3 text-sm text-muted">
          {user?.email || "환영합니다"}
        </p>
      </div>
    </div>
  );
}
