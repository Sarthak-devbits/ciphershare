import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BackgroundPattern } from "./BackgroundPattern";
import { Menu, X } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ href, children, className = "" }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        isActive ? "text-primary" : "text-muted-foreground"
      } ${className}`}
    >
      {children}
    </Link>
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BackgroundPattern />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-background/80 border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold text-primary"
          >
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3l7 4v5c0 4.418-2.686 8.5-7 10-4.314-1.5-7-5.582-7-10V7l7-4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4"
              />
            </svg>
            <span className="tracking-tight">SecureVault</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/my-files">My Files</NavLink>
            <NavLink href="/#how-it-works">How it works</NavLink>
            <NavLink href="/docs">Docs</NavLink>
            <Link
              to="/encrypt"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 pt-2 space-y-3">
            <NavLink href="/my-files" className="block">
              My Files
            </NavLink>
            <NavLink href="/#how-it-works" className="block">
              How it works
            </NavLink>
            <NavLink href="/docs" className="block">
              Docs
            </NavLink>
            <Link
              to="/encrypt"
              className="block w-full text-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-6 mt-12">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground text-center sm:text-left">
          <p>© 2025 SecureVault. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <a
              href="https://github.com/securevault"
              className="hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
