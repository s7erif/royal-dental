import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader, SectionCard } from "@/components/admin/primitives";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const Route = createFileRoute("/admin/_app/profile")({
  ssr: false,
  component: ProfilePage,
});

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUser(data.user)); }, []);

  const email = user?.email || "";
  const name = email.split("@")[0].replace(/[._-]/g, " ") || "المسؤول";
  const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() || "AD";

  return (
    <>
      <PageHeader title="الملف الشخصي" description="إدارة بيانات حسابك الشخصية."
        breadcrumbs={[{ label: "الرئيسية", to: "/admin" }, { label: "الملف الشخصي" }]} />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="الصورة الشخصية" className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)] text-2xl font-black text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 text-base font-bold">{name}</div>
            <div className="text-xs text-muted-foreground">{email}</div>
            <Button variant="outline" size="sm" className="mt-4 w-full">تغيير الصورة</Button>
          </div>
        </SectionCard>

        <SectionCard title="البيانات الشخصية" className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>الاسم الكامل</Label><Input defaultValue={name} /></div>
            <div className="space-y-1.5"><Label>البريد الإلكتروني</Label><Input dir="ltr" defaultValue={email} disabled /></div>
            <div className="space-y-1.5"><Label>رقم الهاتف</Label><Input dir="ltr" placeholder="+20 100 000 0000" /></div>
            <div className="space-y-1.5"><Label>المسمى الوظيفي</Label><Input defaultValue="مدير النظام" /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label>نبذة</Label><Textarea rows={3} placeholder="نبذة قصيرة" /></div>
          </div>
          <div className="mt-5 flex gap-2">
            <Button className="bg-gradient-to-l from-[color:var(--color-gold-dark)] to-[color:var(--color-gold-light)] text-white hover:opacity-95">
              حفظ التغييرات
            </Button>
            <Button variant="outline">إلغاء</Button>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
