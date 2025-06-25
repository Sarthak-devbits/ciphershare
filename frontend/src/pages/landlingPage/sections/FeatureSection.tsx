import {
  ArrowRight,
  Shield,
  Upload,
  Download,
  Lock,
  Eye,
  CheckCircle,
} from "lucide-react";
const FeatureSection = () => {
  return (
    <section
      id="features"
      className="relative py-12 sm:py-16 lg:py-24 bg-gray-50 overflow-hidden"
    >
      {/* Animated Dots Background */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 50 }).map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 1200}
              cy={Math.random() * 800}
              r="2"
              fill="#3B82F6"
              opacity="0.3"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur={`${2 + Math.random() * 3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Enterprise Security Features
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Built with security and compliance as the foundation for
            professional use
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            {
              icon: Eye,
              title: "Zero-Knowledge",
              description:
                "We never see your files, keys, or passwords. Everything happens client-side.",
            },
            {
              icon: Lock,
              title: "AES-256 Encryption",
              description:
                "Military-grade encryption with secure key generation ensures maximum protection.",
            },
            {
              icon: Shield,
              title: "No Server Storage",
              description:
                "Files are encrypted and shared directly. No permanent storage on our servers.",
            },
            {
              icon: CheckCircle,
              title: "Compliance Ready",
              description:
                "Meets GDPR, HIPAA, and SOC 2 requirements for enterprise deployment.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-3 sm:mb-4">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
