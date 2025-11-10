import React from 'react';
import { View } from '../types';
import { LogoIcon } from './icons/LogoIcon';
import { ChatIcon } from './icons/ChatIcon';
import { ImageIcon } from './icons/ImageIcon';
import { SearchIcon } from './icons/SearchIcon';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

interface NavItemProps {
  view: View;
  label: string;
  icon: React.ReactNode;
  activeView: View;
  onClick: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, activeView, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
      activeView === view
        ? 'bg-cyan-600 text-white'
        : 'text-gray-400 hover:bg-slate-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-700 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}>
        <div className="flex items-center justify-center h-20 border-b border-slate-700">
          <LogoIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="ml-3 text-2xl font-bold text-white">AI Suite</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            view={View.Chat}
            label="Chat"
            icon={<ChatIcon className="w-6 h-6" />}
            activeView={activeView}
            onClick={setActiveView}
          />
          <NavItem
            view={View.Image}
            label="Image Gen"
            icon={<ImageIcon className="w-6 h-6" />}
            activeView={activeView}
            onClick={setActiveView}
          />
          <NavItem
            view={View.Search}
            label="Web Search"
            icon={<SearchIcon className="w-6 h-6" />}
            activeView={activeView}
            onClick={setActiveView}
          />
        </nav>
      </div>
       {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};