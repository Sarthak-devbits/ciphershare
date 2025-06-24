import React from 'react';
export function BackgroundPattern() {
  return <div className="fixed inset-0 -z-10 h-full w-full select-none">
      <svg className="absolute h-full w-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40V20H20M40 40V20H20M20 20v20M20 0v20" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="20" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.025] to-transparent" />
    </div>;
}