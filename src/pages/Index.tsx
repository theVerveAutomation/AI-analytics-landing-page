import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeatureExplorer from "@/components/FeatureExplorer";
import Pricing from "@/components/Pricing";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <HowItWorks />
      <FeatureExplorer />
      {/* <Pricing /> */}
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
