import {
  ArrowRight,
  Shield,
  Upload,
  Download,
  Lock,
  Eye,
  CheckCircle,
} from "lucide-react";

const SecuritySection = () => {
  return (
    <section
      id="security"
      className="relative py-12 sm:py-16 lg:py-24 bg-white overflow-hidden"
    >
      {/* Geometric Background */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="animate-pulse">
            <polygon
              points="100,100 200,50 300,100 250,200 150,200"
              fill="#3B82F6"
              opacity="0.3"
            />
            <polygon
              points="800,150 900,100 1000,150 950,250 850,250"
              fill="#3B82F6"
              opacity="0.2"
            />
            <polygon
              points="400,400 500,350 600,400 550,500 450,500"
              fill="#3B82F6"
              opacity="0.15"
            />
          </g>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Security You Can Trust
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Our zero-knowledge architecture ensures that your sensitive data
              remains completely private. With client-side encryption and no
              server storage, you maintain full control over your files.
            </p>
            <div className="space-y-3 sm:space-y-4">
              {[
                "End-to-end encryption with AES-256",
                "Client-side key generation",
                "No data stored on our servers",
                "Open source and auditable",
                "GDPR and HIPAA compliant",
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Bank-Level Security
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  The same encryption standards used by financial institutions
                  to protect your most sensitive data.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      256-bit
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Encryption
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      100%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Private
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
