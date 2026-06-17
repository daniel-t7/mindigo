import { LandingHeader } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Clients } from "@/components/landing/clients";
import { TestsSearch } from "@/components/landing/tests-search";
import { Testimonials } from "@/components/landing/testimonials";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <LandingHeader />
      <Hero />
      <Clients />
      <TestsSearch />
      <Testimonials />
      <Footer />
    </>
  );
}
