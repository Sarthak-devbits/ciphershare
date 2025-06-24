import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BackgroundPattern } from './BackgroundPattern';
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}
const NavLink = ({
  href,
  children,
  className = ''
}: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;
  return <Link to={href} className={`text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'} ${className}`}>
      {children}
    </Link>;
};
export function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background flex flex-col">
      <BackgroundPattern />
      <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-background/80 border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="text-lg font-medium">
            SecureVault
          </Link>
          <nav className="flex items-center gap-6">
            <NavLink href="/my-files">My Files</NavLink>
            <NavLink href="/#how-it-works">How it works</NavLink>
            <NavLink href="/docs">Docs</NavLink>
            <Link to="/encrypt" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Get Started
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2023 SecureVault. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <a href="https://github.com/securevault" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>;
}