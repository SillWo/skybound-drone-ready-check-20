
import { useState } from 'react';
import { DroneHeader } from '@/components/DroneHeader';
import { MinimalistDroneDashboard } from '@/components/MinimalistDroneDashboard';
import { WeatherSection } from '@/components/WeatherSection';
import { PreflightChecklist } from '@/components/PreflightChecklist';

const Index = () => {
  // Mock drone data (in a real app, this would come from device connection)
  const [droneData] = useState({
    batteryLevel: 75,
    signalStrength: 75,
    gpsStatus: 'strong' as 'strong' | 'weak' | 'no-signal',
    checklistProgress: 75
  });
  
  // Mock weather data
  const [isGoodWeather] = useState(true);

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-2 sm:p-4 font-mono">
      <div className="max-w-4xl mx-auto">
        <DroneHeader />
        
        <MinimalistDroneDashboard 
          batteryLevel={droneData.batteryLevel}
          signalStrength={droneData.signalStrength}
          gpsStatus={droneData.gpsStatus}
          checklistProgress={droneData.checklistProgress}
        />
        
        <WeatherSection isGoodWeather={isGoodWeather} />
        
        <PreflightChecklist />
      </div>
    </div>
  );
};

export default Index;
