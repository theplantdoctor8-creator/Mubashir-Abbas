
import React, { useState } from 'react';
import type { View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DiseaseDetector from './components/DiseaseDetector';
import CropAdvisor from './components/CropAdvisor';
import MarketWatch from './components/MarketWatch';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'disease':
        return <DiseaseDetector />;
      case 'advisor':
        return <CropAdvisor />;
      case 'market':
        return <MarketWatch />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50/50 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
