
import React from 'react';

export const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7v0A2.5 2.5 0 0 1 7 4.5v0A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7v0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 14.5 2Z" />
    <path d="M12 12a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-5 0v0a2.5 2.5 0 0 1 2.5-2.5Z" />
    <path d="M20 12c0 4.418-3.582 8-8 8s-8-3.582-8-8c0-2.034.768-3.89 2.023-5.323" />
    <path d="M4 12A8 8 0 0 1 12 4a8 8 0 0 1 8 8" />
  </svg>
);
