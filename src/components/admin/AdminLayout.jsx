import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Image, FileText, Users, Settings, ChevronLeft } from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Events', path: '/admin', icon: Calendar },
  { label: 'Photos', path: '/admin/photos', icon: Image },
  { label: 'Month Overviews', path: '/admin/overviews', icon: FileText },
  { label: 'Members', path: '/admin/members', icon: Users },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-primary text-primary-foreground shrink-0 hidden md:block">
        <div className="p-4 border-b border-primary-foreground/10">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground text-xs transition-colors">
            <ChevronLeft className="w-3 h-3" /> Back to site
          </Link>
          <h2 className="font-serif text-lg font-bold mt-3">Admin Panel</h2>
        </div>
        <nav className="p-2 space-y-0.5">
          {ADMIN_NAV.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                  active
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 bg-background">
        {/* Mobile nav */}
        <div className="md:hidden border-b border-border p-3 flex items-center gap-2 overflow-x-auto">
          {ADMIN_NAV.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs whitespace-nowrap ${
                  active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="p-4 sm:p-6 max-w-5xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}