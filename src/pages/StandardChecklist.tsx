
import { DroneHeader } from '@/components/DroneHeader';
import { PreflightChecklist } from '@/components/PreflightChecklist';
import { MinimalistDroneDashboard } from '@/components/MinimalistDroneDashboard';
import { WeatherSection } from '@/components/WeatherSection';
import { useState } from 'react';

const StandardChecklist = () => {
  const [checklistProgress, setChecklistProgress] = useState(0);

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-2 sm:p-4 font-mono">
      <div className="max-w-4xl mx-auto">
        <DroneHeader />
        
        <MinimalistDroneDashboard
          batteryLevel={75}
          signalStrength={75}
          gpsStatus="strong"
          checklistProgress={checklistProgress}
        />
        
        <WeatherSection />
        
        <PreflightChecklist 
          onProgressUpdate={(progress) => setChecklistProgress(progress)} 
        />
      </div>
    </div>
  );
};

export default StandardChecklist;
