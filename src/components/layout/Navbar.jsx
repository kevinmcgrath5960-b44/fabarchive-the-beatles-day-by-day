import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Timeline', path: '/timeline' },
  { label: 'Members', path: '/members' },
  { label: 'Search', path: '/search' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-accent font-serif text-xl font-bold tracking-tight">◉</span>
            <div className="leading-none">
              <span className="text-sm font-bold tracking-widest uppercase">The Beatles</span>
              <span className="hidden sm:inline text-xs text-primary-foreground/60 ml-2 font-light">Day by Day</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  location.pathname === link.path
                    ? 'text-accent'
                    : 'text-primary-foreground/70 hover:text-primary-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/search" className="ml-2 p-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <Search className="w-4 h-4" />
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-primary-foreground/10 pb-3">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-2.5 text-sm font-medium ${
                location.pathname === link.path
                  ? 'text-accent'
                  : 'text-primary-foreground/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}