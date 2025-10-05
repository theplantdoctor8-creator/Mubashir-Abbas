
import React from 'react';
import type { View } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const LeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0-2.433 2.47.822.822 0 0 1-.645.421 8.253 8.253 0 0 0-4.42 4.472C3.12 14.508 3 15.242 3 16.5A8.25 8.25 0 0 0 12 21a8.25 8.25 0 0 0 9-9.352 8.21 8.21 0 0 0-2.433-2.47.822.822 0 0 1-.645-.421 8.253 8.253 0 0 0-4.42-4.472 8.287 8.287 0 0 0-1.14-.234z" />
  </svg>
);

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-green-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-green-100 hover:text-green-800'
    }`}
  >
    <span className="w-6 h-6 mr-3">{icon}</span>
    <span className="font-medium">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'disease', label: 'Disease Detector', icon: <MagnifyingGlassIcon /> },
    { id: 'advisor', label: 'Crop Advisor', icon: <ChatBubbleLeftRightIcon /> },
    { id: 'market', label: 'Market Watch', icon: <ChartBarIcon /> },
  ] as const;

  return (
    <div className="w-64 bg-white/70 backdrop-blur-sm border-r border-gray-200 p-4 flex-shrink-0 shadow-sm flex flex-col">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
          <LeafIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-green-800">AgriMind</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeView === item.id}
            onClick={() => setActiveView(item.id)}
          />
        ))}
      </nav>
      <div className="mt-auto text-center text-xs text-gray-400">
        <p>&copy; 2024 AgriMind. All rights reserved.</p>
      </div>
    </div>
  );
};


const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>
);

const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
);

const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.054 1.054 0 0 0-.743-.314h-2.133a1.054 1.054 0 0 0-.743.314l-3.72 3.72-1.98-.093c-1.133-.093-1.98-1.057-1.98-2.193v-4.286c0-.97.616-1.813 1.5-2.097m14.25-3.866c.884.284 1.5 1.128 1.5 2.097v4.286c0 .482-.178.933-.47 1.282A11.95 11.95 0 0 1 12 16.5a11.95 11.95 0 0 1-7.78-2.682c-.292-.35-.47-.8-.47-1.282v-4.286c0-.97.616-1.813 1.5-2.097" /></svg>
);

const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
);

export default Sidebar;
