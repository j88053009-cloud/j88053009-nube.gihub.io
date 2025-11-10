import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageIcon } from './icons/ImageIcon';

export const ImageView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="generador-imagenes" className="py-20 px-6 bg-slate-950/50">
        <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Generador de Imágenes con IA</h2>
            <p className="text-lg text-gray-400 mb-8">Da vida a tu imaginación. Describe cualquier cosa que quieras crear.</p>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        placeholder="Ej: El horizonte de una ciudad futurista al atardecer"
                        className="flex-grow bg-slate-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className="px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Generando...' : 'Generar'}
                    </button>
                </div>
            </div>

            <div className="aspect-square mt-8 w-full flex items-center justify-center bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg">
                {isLoading && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                        <p className="mt-4 text-gray-400">Creando tu obra maestra...</p>
                    </div>
                )}
                {error && <p className="text-red-400">{error}</p>}
                {imageUrl && !isLoading && (
                    <img src={imageUrl} alt={prompt} className="max-w-full max-h-full object-contain rounded-lg" />
                )}
                {!isLoading && !imageUrl && !error && (
                    <div className="text-center text-gray-500">
                        <ImageIcon className="w-24 h-24 mx-auto mb-4" />
                        <p>Tu imagen generada aparecerá aquí.</p>
                    </div>
                )}
            </div>
        </div>
    </section>
  );
};