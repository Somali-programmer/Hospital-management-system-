import React from 'react';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="glass-panel p-8 flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 bg-slate-50/50">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 font-medium">This module is currently under clinical review. Check back soon!</p>
    </div>
  );
}
