import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Crown, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/forgot-password")({
  head: () => ({
    meta: [
      { title: "استعادة كلمة المرور — لوحة تحكم رويال ديـنـتـال" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[color:var(--color-cream)] text-[color:var(--color-charcoal)]" dir="rtl">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)]">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold">رويال ديـنـتـال</div>
              <div className="text-[10px] tracking-[0.15em] text-[color:var(--color-gold-dark)]">لوحة التحكم</div>
            </div>
          </div>

          {sent ? (
            <div className="rounded-2xl border border-white/60 bg-white p-6 text-center shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)]">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <MailCheck className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-lg font-bold">تحقق من بريدك الإلكتروني</h1>
              <p className="mt-1 text-sm text-[color:var(--color-charcoal)]/60">
                أرسلنا رابط استعادة كلمة المرور إلى <span className="font-semibold">{email}</span>. تحقق من صندوق الوارد لديك.
              </p>
              <Link to="/admin/login" className="mt-6 inline-block text-sm font-semibold text-[color:var(--color-gold-dark)] hover:underline">
                ← العودة إلى تسجيل الدخول
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-black">استعادة كلمة المرور</h1>
              <p className="mt-1 text-sm text-[color:var(--color-charcoal)]/60">
                أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@royaldental.eg"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full gap-2 bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white hover:opacity-95"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  إرسال رابط الاستعادة
                </Button>
              </form>
              <div className="mt-6 text-center text-xs">
                <Link to="/admin/login" className="text-[color:var(--color-charcoal)]/60 hover:text-[color:var(--color-gold-dark)] hover:underline">
                  ← العودة إلى تسجيل الدخول
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
