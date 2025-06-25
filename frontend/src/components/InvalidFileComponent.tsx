import React from "react";

const InvalidFileComponent = () => {
  return (
    <div className="container py-20 max-w-xl text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100 text-red-500">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01M5.07 19h13.86c1.1 0 2-.9 2-2V7a2 2 0 00-2-2H5.07a2 2 0 00-2 2v10c0 1.1.9 2 2 2z"
          />
        </svg>
      </div>
      <h1 className="text-2xl md:text-3xl font-semibold mb-2">
        Invalid or Missing File ID
      </h1>
      <p className="text-muted-foreground text-base">
        Please provide a valid file ID in the URL to access this file. You may
        have clicked an outdated or broken link.
      </p>
    </div>
  );
};

export default InvalidFileComponent;
