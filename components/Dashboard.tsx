
import React from 'react';
import type { View } from '../types';

interface DashboardProps {
  setActiveView: (view: View) => void;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}> = ({ icon, title, description, onClick, color }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
  >
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mt-4">{title}</h3>
    <p className="text-gray-500 mt-2 text-sm">{description}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
        <img src="https://picsum.photos/1200/400?random=1" alt="Lush green field" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Welcome to <span className="text-green-400">AgriMind</span>
          </h1>
          <p className="mt-4 text-lg text-green-100 max-w-2xl">
            Your AI-powered partner in modern farming. Get instant insights to cultivate success.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<MagnifyingGlassIcon className="w-8 h-8 text-blue-800" />}
          title="Disease Detector"
          description="Upload an image of a plant leaf to instantly identify diseases and get treatment advice."
          onClick={() => setActiveView('disease')}
          color="bg-blue-100"
        />
        <FeatureCard
          icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-800" />}
          title="Crop Advisor"
          description="Chat with our AI expert about crop management, soil health, and farming best practices."
          onClick={() => setActiveView('advisor')}
          color="bg-purple-100"
        />
        <FeatureCard
          icon={<ChartBarIcon className="w-8 h-8 text-yellow-800" />}
          title="Market Watch"
          description="Stay ahead with AI-driven market analysis and price trends for your chosen crops."
          onClick={() => setActiveView('market')}
          color="bg-yellow-100"
        />
      </div>
    </div>
  );
};


const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
);

const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.054 1.054 0 0 0-.743-.314h-2.133a1.054 1.054 0 0 0-.743.314l-3.72 3.72-1.98-.093c-1.133-.093-1.98-1.057-1.98-2.193v-4.286c0-.97.616-1.813 1.5-2.097m14.25-3.866c.884.284 1.5 1.128 1.5 2.097v4.286c0 .482-.178.933-.47 1.282A11.95 11.95 0 0 1 12 16.5a11.95 11.95 0 0 1-7.78-2.682c-.292-.35-.47-.8-.47-1.282v-4.286c0-.97.616-1.813 1.5-2.097" /></svg>
);

const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
);

export default Dashboard;
