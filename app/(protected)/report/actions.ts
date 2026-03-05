"use server";

import { db } from "@/db";
import { befeCouples } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveHasChildren(coupleId: string, hasChildren: boolean) {
  await db
    .update(befeCouples)
    .set({
      has_children: hasChildren,
      updated_at: new Date().toISOString(),
    })
    .where(eq(befeCouples.id, coupleId));
}
