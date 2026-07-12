// Shared server-side helpers for admin-only operations.
// This file's name ending in .server.ts guarantees it never ships to the client bundle.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function requireAdmin(userId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export async function isFirstAdminBootstrap(): Promise<boolean> {
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) return false;
  return (count ?? 0) === 0;
}
