import ScrollReveal from "@/components/ScrollReveal";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Teachers from "@/components/Teachers";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <ScrollReveal>
        <main>
          <Hero />
          <Stats />
          <HowItWorks />
          <Features />
          <Teachers />
          <Testimonials />
          <CTASection />
        </main>
        <Footer />
      </ScrollReveal>
    </>
  );
}
