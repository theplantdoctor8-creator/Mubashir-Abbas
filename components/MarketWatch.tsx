
import React, { useState, useCallback } from 'react';
import { getMarketAnalysis } from '../services/geminiService';
import type { MarketAnalysis } from '../types';

const CROPS = ['Wheat', 'Corn', 'Soybeans', 'Rice', 'Cotton', 'Coffee'];

const MarketWatch: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFetchAnalysis = useCallback(async (crop: string) => {
    setSelectedCrop(crop);
    setIsLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const result = await getMarketAnalysis(crop);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Crop Market Watch</h2>
            <p className="text-gray-500 mt-2">Select a crop to get the latest AI-driven market analysis.</p>
        </div>
      
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {CROPS.map((crop) => (
          <button
            key={crop}
            onClick={() => handleFetchAnalysis(crop)}
            disabled={isLoading}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 shadow-sm disabled:opacity-50 ${
              selectedCrop === crop
                ? 'bg-green-600 text-white ring-2 ring-offset-2 ring-green-600'
                : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
            }`}
          >
            {crop}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg min-h-[24rem]">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Spinner />
            <p className="mt-2 font-medium">Fetching market data for {selectedCrop}...</p>
          </div>
        )}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p>{error}</p></div>}
        
        {analysis && (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-green-800 mb-4">{selectedCrop} Market Analysis</h3>
            <div className="prose max-w-none text-gray-700">
                <p>{analysis.summary}</p>
            </div>
            
            {analysis.sources.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-600">Sources:</h4>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {analysis.sources.map((source, index) => (
                    <li key={index} className="text-sm">
                      <a
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 hover:underline"
                      >
                        {source.web.title || source.web.uri}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!isLoading && !analysis && !error && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ChartBarIcon className="w-16 h-16" />
                <p className="mt-4 text-lg">Select a crop to view its market analysis.</p>
            </div>
        )}
      </div>
    </div>
  );
};


const Spinner: React.FC = () => (
    <svg className={`animate-spin h-8 w-8 text-green-600`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
);

export default MarketWatch;
