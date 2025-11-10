import React, { useState, useRef, useEffect } from 'react';
import { getGroundedResponse } from '../services/geminiService';
import { GroundedMessage } from '../types';
import { SendIcon } from './icons/SendIcon';
import { SearchIcon } from './icons/SearchIcon';

export const SearchView: React.FC = () => {
  const [messages, setMessages] = useState<GroundedMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: GroundedMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { text, sources } = await getGroundedResponse(input);
      const modelMessage: GroundedMessage = { role: 'model', text, sources };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: GroundedMessage = { role: 'model', text: 'Lo siento, no pude obtener una respuesta. Por favor, inténtalo de nuevo.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="busqueda-web" className="py-20 px-6 bg-[#0A192F]">
        <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Búsqueda Web Conectada</h2>
                <p className="text-lg text-gray-400">Haz preguntas sobre eventos recientes o temas de actualidad para obtener respuestas actualizadas.</p>
            </div>
            <div className="w-full h-[70vh] flex flex-col bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <SearchIcon className="w-24 h-24 mb-4" />
                            <p>Las respuestas aparecerán aquí.</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index}>
                                <div className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 font-bold">G</div>}
                                    <div className={`max-w-xl p-3 rounded-2xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                                {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                                    <div className="max-w-xl ml-11 mt-2">
                                        <h4 className="text-sm font-semibold text-gray-400 mb-1">Fuentes:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {msg.sources.map((source, i) => (
                                                <a
                                                    key={i}
                                                    href={source.web.uri}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs bg-slate-600 hover:bg-slate-500 text-cyan-300 px-2 py-1 rounded-full transition-colors"
                                                >
                                                    {source.web.title || new URL(source.web.uri).hostname}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 font-bold">G</div>
                            <div className="max-w-xl p-3 rounded-2xl bg-slate-700 rounded-bl-none flex items-center space-x-1">
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-0"></span>
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-200"></span>
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-400"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 md:p-6 bg-slate-800/80 border-t border-slate-700">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Haz una pregunta..."
                            className="w-full bg-slate-700 text-white rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                        >
                            <SendIcon className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};