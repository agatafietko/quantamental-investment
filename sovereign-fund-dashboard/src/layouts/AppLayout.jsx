import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '../lib/utils';
import { BookOpen, LineChart, ShieldAlert } from 'lucide-react';

export default function AppLayout() {
  const navItems = [
    { name: "THE LEDGER", path: "/", icon: <BookOpen className="w-5 h-5 mr-3 hidden" /> }, // hidden icons per constraints
    { name: "DEEP DIVE", path: "/deep-dive", icon: <LineChart className="w-5 h-5 mr-3 hidden" /> },
    { name: "WAR ROOM", path: "/war-room", icon: <ShieldAlert className="w-5 h-5 mr-3 hidden" /> },
  ];

  return (
    <div className="flex min-h-screen w-full bg-ivory">
      {/* Masthead / Sidebar */}
      <aside className="w-72 bg-ivory text-ink flex flex-col pt-12 pb-6 px-8 flex-shrink-0 z-10 shadow-ambient">
        <div className="mb-16">
          {/* Asymmetric heavy masthead title */}
          <h1 className="font-serif text-[2.5rem] leading-[1.1] tracking-tight font-medium">
            Sovereign<br />Fund<br />Command
          </h1>
          <div className="mt-4 border-t-[0.5pt] border-gold w-16" />
        </div>

        <nav className="flex-1 flex flex-col space-y-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "font-sans text-xs uppercase tracking-[0.1em] font-medium transition-colors flex items-center",
                  isActive ? "text-ink font-bold" : "text-ink/60 hover:text-ink"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Subtle active indicator without typical app pill shapes */}
                  {isActive && <span className="w-1.5 h-1.5 bg-gold mr-3 inline-block" />}
                  {!isActive && <span className="w-1.5 h-1.5 mr-3 inline-block" />}
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <p className="font-sans text-[0.65rem] text-ink/50 uppercase tracking-[0.05em]">
            System Status: 
            <span className="text-gold font-bold ml-2">CONFIRMED</span>
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-ivory-low pt-12 px-16 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
