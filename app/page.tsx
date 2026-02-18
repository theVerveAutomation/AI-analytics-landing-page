import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeatureExplorer from "@/components/FeatureExplorer";
import Pricing from "@/components/Pricing";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        navType="homePageNav"
        navigation={[
          { label: "Features", section: "features" },
          { label: "Solutions", section: "how-it-works" },
          { label: "Industries", section: "features" },
          { label: "Pricing", section: "pricing" },
          { label: "Shop", href: "/shop" },
        ]}
      />
      <Hero />
      <HowItWorks />
      <FeatureExplorer />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
