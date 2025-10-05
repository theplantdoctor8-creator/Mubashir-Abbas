import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ChatMessage } from '../types';

const CROPS = ['General', 'Wheat', 'Corn', 'Soybeans', 'Rice', 'Cotton', 'Coffee'];

const CropAdvisor: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('General');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY is not set.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const systemInstruction = selectedCrop === 'General'
            ? 'You are a friendly and knowledgeable agricultural advisor. Provide clear, concise, and helpful advice to farmers and gardeners. Use simple language and structure your answers with formatting like lists or bold text for readability.'
            : `You are a friendly and knowledgeable agricultural advisor specializing in ${selectedCrop}. Provide clear, concise, and helpful advice to farmers and gardeners specifically about growing and managing ${selectedCrop}. Use simple language and structure your answers with formatting like lists or bold text for readability.`;

        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });

        const initialMessage = selectedCrop === 'General'
            ? "Hello! I'm your AI Crop Advisor. How can I help you with your farm or garden today?"
            : `Hello! I'm your specialist AI Advisor for ${selectedCrop}. What would you like to know?`;

        setMessages([{ role: 'model', content: initialMessage }]);
        setError('');
        setInput('');

    } catch(e: any) {
        setError("Failed to initialize the chat service. Please check your API key.");
        console.error(e);
    }
  }, [selectedCrop]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;
    
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const stream = await chatRef.current.sendMessageStream({ message: input });
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = modelResponse;
            return newMessages;
        });
      }
    } catch (e: any) {
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      setError(errorMessage);
      setMessages(prev => [...prev.slice(0, -1), { role: 'model', content: errorMessage }]);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-xl font-bold text-gray-800">AI Crop Advisor</h2>
        <div>
            <label htmlFor="crop-select" className="text-sm font-medium text-gray-700 mr-2">
            Focus:
            </label>
            <select
            id="crop-select"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 bg-gray-50"
            >
            {CROPS.map(crop => <option key={crop} value={crop}>{crop}</option>)}
            </select>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">A</div>}
            <div className={`max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
             <div className="flex items-end gap-2 justify-start">
                 <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">A</div>
                 <div className="max-w-lg p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    </div>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && <div className="p-4 text-center text-sm text-red-600 bg-red-50">{error}</div>}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={selectedCrop === 'General' ? 'Ask about crops, soil, pests...' : `Ask me anything about ${selectedCrop}...`}
            className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

const PaperAirplaneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
);

export default CropAdvisor;