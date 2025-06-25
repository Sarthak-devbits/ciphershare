import { ArrowRight, Download, Shield, Upload } from "lucide-react";
import React from "react";

const HowItWorkSection = () => {
  return (
    <section
      id="how-it-works"
      className="relative py-12 sm:py-16 lg:py-24 bg-white overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Three simple steps to secure file sharing with enterprise-grade
            encryption
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {[
            {
              step: "01",
              icon: Upload,
              title: "Upload & Encrypt",
              description:
                "Your files are encrypted locally in your browser using AES-256 encryption. No data ever leaves your device unprotected.",
            },
            {
              step: "02",
              icon: Shield,
              title: "Generate Secure Link",
              description:
                "Create a tamper-proof sharing link with the decryption key embedded or protected by a password of your choice.",
            },
            {
              step: "03",
              icon: Download,
              title: "Recipient Decrypts",
              description:
                "Recipients decrypt and download files directly in their browser. No accounts, no software, no compromises.",
            },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-primary flex items-center justify-center mr-3 sm:mr-4">
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-300">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-6 transform -translate-y-1/2">
                  <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorkSection;
