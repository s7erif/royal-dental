import { Suspense, lazy, useEffect, useState } from "react";
import { FloatingSocialIcons } from "@/components/site/SocialIcons";
import { nav } from "@/components/landing/_shared";
import { Loader } from "@/components/landing/Loader";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StatsSection } from "@/components/landing/StatsSection";
import { About } from "@/components/landing/About";
import { Services } from "@/components/landing/Services";
import { Offers } from "@/components/landing/Offers";
import { WhyUs } from "@/components/landing/WhyUs";
import { Footer } from "@/components/landing/Footer";
import { ScrollTop } from "@/components/landing/ScrollTop";

// Heavy, below-the-fold sections are code-split so their JS (embla, framer
// modals, lightbox, accordion, form libs) is fetched only when needed.
const BeforeAfter = lazy(() => import("@/components/landing/BeforeAfter"));
const Doctor = lazy(() => import("@/components/landing/Doctor"));
const Testimonials = lazy(() => import("@/components/landing/Testimonials"));
const ClinicGallery = lazy(() => import("@/components/landing/ClinicGallery"));
const BookingForm = lazy(() => import("@/components/landing/BookingForm"));
const FAQ = lazy(() => import("@/components/landing/FAQ"));
const Contact = lazy(() => import("@/components/landing/Contact"));

function SectionSkeleton({ minH = "min-h-[420px]" }: { minH?: string }) {
  return <div className={`${minH} w-full`} aria-hidden />;
}

export default function RoyalDentalLanding() {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    if (document.readyState === "complete") {
      setLoaded(true);
      return;
    }
    const finish = () => setLoaded(true);
    window.addEventListener("load", finish, { once: true });
    const t = setTimeout(finish, 1500);
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    document.documentElement.style.scrollBehavior = "smooth";
  }, [loaded]);

  useEffect(() => {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
    const ids = nav.map((n) => n.id);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div
      dir="rtl"
      lang="ar"
      className="relative min-h-screen bg-[color:var(--color-cream)] text-[color:var(--color-charcoal)] antialiased"
      style={{ fontFamily: "Cairo, system-ui, sans-serif" }}
    >
      <Loader done={loaded} />
      <Navbar active={active} />
      <main>
        <Hero />
        <StatsSection />
        <About />
        <Services />
        <Offers />
        <WhyUs />
        <Suspense fallback={<SectionSkeleton />}>
          <BeforeAfter />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Doctor />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ClinicGallery />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <BookingForm />
        </Suspense>
        <Suspense fallback={<SectionSkeleton minH="min-h-[240px]" />}>
          <FAQ />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <FloatingSocialIcons />
      <ScrollTop />
    </div>
  );
}
