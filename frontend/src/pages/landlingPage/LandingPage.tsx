import {
  ArrowRight,
  Shield,
  Upload,
  Download,
  Lock,
  Eye,
  CheckCircle,
} from "lucide-react";
import HeroSection from "./sections/HeroSection";
import HowItWorkSection from "./sections/HowItWorkSection";
import FeatureSection from "./sections/FeatureSection";
import SecuritySection from "./sections/SecuritySection";
import { CTAsection } from "./sections/CTAsection";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />
      {/* How It Works Section */}
      <HowItWorkSection />
      {/* Features Section */}
      <FeatureSection />
      {/* Security Section */}
      <SecuritySection />
      {/* CTA Section */}

      <CTAsection />
    </div>
  );
}
