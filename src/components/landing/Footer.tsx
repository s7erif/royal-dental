import { Crown } from "lucide-react";
import { SocialIcons } from "@/components/site/SocialIcons";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[color:var(--color-charcoal)] py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 text-center sm:px-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)]">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">مركز رويال ديـنـتـال</div>
              <div className="text-[10px] tracking-[0.2em] text-[color:var(--color-gold-light)] font-semibold">
                د. مصطفى بكر
              </div>
            </div>
          </div>
          <SocialIcons className="justify-center" />
        </div>
        <div className="text-xs text-white/50">
          © {new Date().getFullYear()} مركز رويال ديـنـتـال. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
