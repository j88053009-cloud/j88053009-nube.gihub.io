import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessageStream, startChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SendIcon } from './icons/SendIcon';
import { LogoIcon } from './icons/LogoIcon';

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    startChat([]);
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await sendMessageStream(input);
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', parts: [{ text: modelResponse }] };
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Sorry, I encountered an error.' }] }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <div className="flex flex-col h-full bg-slate-800 text-white">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
            <LogoIcon className="w-24 h-24 mb-4 text-cyan-500" />
            <h2 className="text-2xl font-bold">AI Assistant</h2>
            <p>How can I help you today?</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 font-bold">G</div>}
              <div className={`max-w-xl p-3 rounded-2xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}>
                {msg.parts[0].text}
                {isLoading && msg.role === 'model' && index === messages.length - 1 && <span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse" />}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 md:p-6 bg-slate-800/50 border-t border-slate-700">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            className="w-full bg-slate-700 text-white rounded-lg p-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={1}
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
  );
};