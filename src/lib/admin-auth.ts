// Real Cloud auth wrappers used by the admin panel.
import { supabase } from "@/integrations/supabase/client";

const THEME_KEY = "royal_admin_theme";

export async function signIn(email: string, password: string, _remember: boolean) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error("بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.");
  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { emailRedirectTo: window.location.origin + "/admin" },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export function getStoredTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return (window.localStorage.getItem(THEME_KEY) as "light" | "dark") || "light";
}

export function setStoredTheme(theme: "light" | "dark") {
  window.localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}
