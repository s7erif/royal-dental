import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Crown, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn, signUp } from "@/lib/admin-auth";
import { supabase } from "@/integrations/supabase/client";
import { bootstrapFirstAdmin } from "@/lib/services.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — لوحة تحكم رويال ديـنـتـال" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  ssr: false,
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(email, password);
        // Try to bootstrap as first admin (only succeeds if no admin exists yet).
        try {
          await bootstrapFirstAdmin();
          toast.success("تم إنشاء حساب المسؤول بنجاح");
        } catch {
          toast.info("تم إنشاء الحساب. لم يتم منح صلاحية المسؤول (يوجد مسؤول بالفعل).");
        }
      } else {
        await signIn(email, password, remember);
      }
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--color-cream)] text-[color:var(--color-charcoal)]" dir="rtl">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[color:var(--color-charcoal)] to-[#2a2a2a] p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[color:var(--color-gold-dark)]/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-[color:var(--color-gold-light)]/15 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)] shadow-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight text-white">
              <div className="text-lg font-bold">رويال ديـنـتـال</div>
              <div className="text-[11px] tracking-[0.2em] text-[color:var(--color-gold-light)]">لوحة التحكم</div>
            </div>
          </div>
          <div className="relative text-white">
            <div className="text-xs font-bold tracking-[0.2em] text-[color:var(--color-gold-light)]">مرحباً بعودتك</div>
            <h2 className="mt-3 text-4xl font-black leading-tight">أدر عيادتك <br /> بلمسة ملكية.</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              لوحة تحكم متكاملة لإدارة جميع محتويات موقع العيادة.
            </p>
          </div>
          <div className="relative text-[11px] text-white/40">© {new Date().getFullYear()} رويال ديـنـتـال</div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex items-center gap-2.5 lg:hidden">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)]">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold">رويال ديـنـتـال</div>
                <div className="text-[10px] tracking-[0.15em] text-[color:var(--color-gold-dark)]">لوحة التحكم</div>
              </div>
            </div>

            <h1 className="text-2xl font-black">{mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب مسؤول"}</h1>
            <p className="mt-1 text-sm text-[color:var(--color-charcoal)]/60">
              {mode === "signin"
                ? "أدخل بيانات حسابك للوصول إلى لوحة التحكم."
                : "أنشئ حسابك — أول حساب يحصل تلقائياً على صلاحيات المسؤول."}
            </p>

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" autoComplete="email" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">كلمة المرور</Label>
                  {mode === "signin" && (
                    <Link to="/admin/forgot-password" className="text-xs font-semibold text-[color:var(--color-gold-dark)] hover:underline">
                      نسيت كلمة المرور؟
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Input id="password" type={showPass ? "text" : "password"} required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    minLength={6} className="pl-9" />
                  <button type="button" onClick={() => setShowPass((s) => !s)}
                    className="absolute left-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-[color:var(--color-charcoal)]/50 hover:bg-black/5"
                    aria-label={showPass ? "إخفاء" : "إظهار"}>
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === "signin" && (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} id="remember" />
                  <span className="text-[color:var(--color-charcoal)]/70">تذكرني على هذا الجهاز</span>
                </label>
              )}

              <Button type="submit" disabled={loading}
                className="h-11 w-full gap-2 bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white shadow-md hover:opacity-95">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "signin" ? (loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول") : (loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب")}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-[color:var(--color-charcoal)]/60">
              {mode === "signin" ? (
                <>ليس لديك حساب؟{" "}
                  <button onClick={() => { setMode("signup"); setError(null); }} className="font-semibold text-[color:var(--color-gold-dark)] hover:underline">
                    أنشئ حساب المسؤول الأول
                  </button>
                </>
              ) : (
                <>لديك حساب بالفعل؟{" "}
                  <button onClick={() => { setMode("signin"); setError(null); }} className="font-semibold text-[color:var(--color-gold-dark)] hover:underline">
                    سجّل الدخول
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 text-center text-xs">
              <Link to="/" className="text-[color:var(--color-charcoal)]/50 hover:text-[color:var(--color-gold-dark)] hover:underline">
                ← العودة إلى الموقع
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
