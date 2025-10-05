
import React, { useState, useCallback, useRef } from 'react';
import { analyzePlantDisease } from '../services/geminiService';

const DiseaseDetector: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setAnalysis('');
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError('Please select an image file first.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysis('');
    try {
      const result = await analyzePlantDisease(imageFile);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const triggerFileSelect = () => fileInputRef.current?.click();

  const renderAnalysis = (text: string) => {
    const sections = text.split(/\*\*(.*?)\*\*/g).filter(Boolean);
    return sections.map((section, index) => {
        if (index % 2 === 0) { // Regular text
            return section.split('\n').map((line, i) => <p key={`${index}-${i}`} className="mb-2 text-gray-700">{line}</p>);
        } else { // Bolded titles
            return <h3 key={index} className="text-xl font-semibold text-green-800 mt-4 mb-2">{section.trim().replace(/:$/, '')}</h3>;
        }
    });
};


  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Plant Disease Detector</h2>
        <p className="text-gray-500 mt-2">Upload an image of a plant leaf to get an AI-powered analysis.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col items-center">
            <div 
                onClick={triggerFileSelect}
                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
            >
            {imagePreview ? (
              <img src={imagePreview} alt="Plant preview" className="max-h-full max-w-full object-contain rounded-md" />
            ) : (
              <div className="text-center text-gray-500">
                <PhotoIcon className="w-12 h-12 mx-auto mb-2 text-gray-400"/>
                <p className="font-semibold">Click to upload an image</p>
                <p className="text-xs">PNG, JPG, or WEBP</p>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
           <button
                onClick={handleAnalyze}
                disabled={!imageFile || isLoading}
                className="mt-4 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
            >
                {isLoading ? (
                    <>
                        <Spinner />
                        Analyzing...
                    </>
                ) : (
                    <>
                    <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                    Analyze Plant
                    </>
                )}
            </button>
        </div>

        <div className="mt-6 md:mt-0">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Analysis Result</h3>
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p>{error}</p></div>}
          
          <div className="prose max-w-none p-4 bg-gray-50 rounded-lg min-h-[20rem] overflow-y-auto">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Spinner size="lg"/>
                    <p className="mt-2">AI is inspecting the image...</p>
                </div>
            ) : analysis ? (
                renderAnalysis(analysis)
            ) : (
                <p className="text-gray-500">Your analysis will appear here.</p>
            )}
           </div>
        </div>
      </div>
    </div>
  );
};

const PhotoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
);

const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
);

const Spinner: React.FC<{size?: 'sm' | 'lg'}> = ({ size = 'sm' }) => (
    <svg className={`animate-spin ${size === 'sm' ? 'h-5 w-5' : 'h-8 w-8'} mr-3 text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export default DiseaseDetector;
