import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setResponse("This is a sample AI response that would appear in this beautifully styled box!");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
        <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          AI Prompt Generator
        </h1>
        <p className="text-gray-300 mb-8">Get intelligent responses powered by AI</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea 
              className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your prompt here..."
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Response'
            )}
          </button>
        </form>

        {response && (
          <div className="mt-8 bg-white/5 border border-white/10 rounded-lg p-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-4">AI Response</h2>
            <div className="text-gray-300 leading-relaxed">
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;