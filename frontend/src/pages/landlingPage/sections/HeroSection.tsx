import { ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-12 sm:py-16 lg:py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Enterprise-grade security
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
            End-to-End Encrypted
            <br />
            <span className="text-primary">File Sharing</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Encrypt and share files directly from your browser — no servers ever
            see your data. Professional-grade security for businesses and
            individuals.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4">
            <button
              onClick={() => navigate("/encrypt")}
              className="w-full sm:w-auto  px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors transition-colors flex items-center justify-center shadow-lg"
            >
              Encrypt a File
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            {[
              { number: "256-bit", label: "AES Encryption" },
              { number: "0", label: "Server Storage" },
              { number: "99.9%", label: "Uptime SLA" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
