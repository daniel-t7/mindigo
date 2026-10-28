import { LandingLayout } from "@/_components/landing/landing-layout";
import { LandingHeader } from "@/_components/landing/header";
import { Hero } from "@/_components/landing/hero";
// import { Clients } from "@/_components/landing/clients";
import { TestsSearch } from "@/_components/landing/tests-search";
import { Testimonials } from "@/_components/landing/testimonials";
import { Footer } from "@/_components/landing/footer";

export default function Home() {
  return (
    <LandingLayout>
      <LandingHeader />
      <Hero />
      {/*<Clients />*/}
      <TestsSearch />
      <Testimonials />
      <Footer />
    </LandingLayout>
  );
}
