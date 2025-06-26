import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const CTAsection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-12 sm:pt-16 lg:py-24 bg-primary overflow-hidden">
      {/* Wave Background */}
      <div className="absolute inset-0 opacity-20">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,200 Q300,100 600,200 T1200,200 V400 H0 Z"
            fill="white"
            opacity="0.1"
          >
            <animate
              attributeName="d"
              values="M0,200 Q300,100 600,200 T1200,200 V400 H0 Z;M0,200 Q300,300 600,200 T1200,200 V400 H0 Z;M0,200 Q300,100 600,200 T1200,200 V400 H0 Z"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
          Ready to Secure Your Files?
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-8 sm:mb-10 max-w-2xl mx-auto">
          Join thousands of professionals who trust SecureShare for their
          sensitive file sharing needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={() => navigate("/encrypt")}
            className="w-full sm:w-auto bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Start Encrypting Now
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="w-full sm:w-auto border border-blue-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};
