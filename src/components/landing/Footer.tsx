import { Crown } from "lucide-react";
import { SocialIcons } from "@/components/site/SocialIcons";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[color:var(--color-charcoal)] py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 text-center sm:px-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--color-gold-light)] to-[color:var(--color-gold-dark)]">
<img
  src="/logo.png"
  alt="Royal Dental"
  className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
/>
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
        
        <div className="mt-3 border-t border-white/10 pt-4 text-center">
  <p className="text-sm text-white/60">
    Designed &amp; Developed by
  </p>

  <a
    href="https://www.facebook.com/shryf.thman.462491"
    target="_blank"
    rel="noopener noreferrer"
    dir="ltr"
    className="mt-2 inline-block font-semibold text-[color:var(--color-gold)] hover:text-[color:var(--color-gold-dark)] transition-colors"
  >
    Sherif Osman
  </a>
</div>
      </div>
    </footer>
  );
}
