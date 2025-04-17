
import React from 'react';
import { Shield, CloudSun, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DroneHeader = () => {
  return (
    <header className="w-full bg-card shadow-sm p-4 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">SkyBound</h1>
          <span className="bg-accent/20 text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">
            Pre-Flight Check
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
            <CloudSun className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">22°C - Light Wind</span>
          </div>
          
          <button className="bg-warning/20 hover:bg-warning/30 text-warning-foreground flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors">
            <AlertTriangle className="h-4 w-4" />
            Report Issue
          </button>
        </div>
      </div>
    </header>
  );
};
