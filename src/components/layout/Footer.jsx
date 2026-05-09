import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg text-primary-foreground font-semibold mb-2">The Beatles — Day by Day</h3>
            <p className="text-sm leading-relaxed">
              An encyclopaedic chronicle of the Beatles from 1962 to 1971, covering every recording session, performance, and milestone.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-foreground/40 mb-3">Navigate</h4>
            <div className="space-y-1.5">
              <Link to="/" className="block text-sm hover:text-primary-foreground transition-colors">Home</Link>
              <Link to="/timeline" className="block text-sm hover:text-primary-foreground transition-colors">Timeline</Link>
              <Link to="/members" className="block text-sm hover:text-primary-foreground transition-colors">Members</Link>
              <Link to="/search" className="block text-sm hover:text-primary-foreground transition-colors">Search</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-foreground/40 mb-3">Years</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 10 }, (_, i) => 1962 + i).map(year => (
                <Link
                  key={year}
                  to={`/timeline?year=${year}`}
                  className="text-sm hover:text-accent transition-colors"
                >
                  {year}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-xs text-primary-foreground/30">
          This is a fan-made historical archive. Not affiliated with Apple Corps Ltd.
        </div>
      </div>
    </footer>
  );
}