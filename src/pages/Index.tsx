
import { useState, useEffect } from 'react';
import { DroneHeader } from '@/components/DroneHeader';
import { MinimalistDroneDashboard } from '@/components/MinimalistDroneDashboard';
import { WeatherSection } from '@/components/WeatherSection';
import { PreflightChecklist } from '@/components/PreflightChecklist';
import { ReportManager } from '@/components/report/ReportManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchWeatherData } from '@/services/weatherService';

const Index = () => {
  // Drone data state with updatable checklist progress
  const [droneData, setDroneData] = useState({
    batteryLevel: 75,
    signalStrength: 75,
    gpsStatus: 'strong' as 'strong' | 'weak' | 'no-signal',
    checklistProgress: 0
  });
  
  // Weather data
  const [isGoodWeather, setIsGoodWeather] = useState(true);
  
  // Load initial weather data
  useEffect(() => {
    async function loadWeather() {
      try {
        const weather = await fetchWeatherData();
        setIsGoodWeather(weather.isGoodWeather);
      } catch (error) {
        console.error("Failed to load initial weather data:", error);
      }
    }
    
    loadWeather();
  }, []);
  
  // Handle checklist progress update
  const handleProgressUpdate = (progress: number) => {
    setDroneData(prev => ({
      ...prev,
      checklistProgress: progress
    }));
  };

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
        
        <Tabs defaultValue="standard-checklist" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="standard-checklist" className="font-mono">Стандартный чек-лист</TabsTrigger>
            <TabsTrigger value="report-constructor" className="font-mono">Конструктор отчетов</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard-checklist">
            <PreflightChecklist onProgressUpdate={handleProgressUpdate} />
          </TabsContent>
          
          <TabsContent value="report-constructor">
            <ReportManager 
              droneData={droneData}
              onProgressUpdate={handleProgressUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
