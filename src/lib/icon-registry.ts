// Icon registry: string name -> lucide component.
// Used by both the admin IconPicker and the public site to render icons stored in DB.
import {
  Stethoscope, Sparkles, Sparkle, HeartPulse, Crown, Smile, Baby, Zap,
  ShieldCheck, Brush, Scissors, Award, Activity, Microscope, Wallet,
  Users, Star, Percent, Calendar, Phone, Camera, Diamond, Gem,
  type LucideIcon,
} from "lucide-react";

export const iconRegistry: Record<string, LucideIcon> = {
  Stethoscope, Sparkles, Sparkle, HeartPulse, Crown, Smile, Baby, Zap,
  ShieldCheck, Brush, Scissors, Award, Activity, Microscope, Wallet,
  Users, Star, Percent, Calendar, Phone, Camera, Diamond, Gem,
};

export const iconNames = Object.keys(iconRegistry);

export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Stethoscope;
  return iconRegistry[name] ?? Stethoscope;
}
