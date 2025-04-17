
import { useState, useEffect } from 'react';
import { DroneHeader } from '@/components/DroneHeader';
import { DroneDashboard } from '@/components/DroneDashboard';
import { WeatherConditions } from '@/components/WeatherConditions';
import { ChecklistSection } from '@/components/ChecklistSection';

// Define checklist data
const checklistSections = [
  {
    title: "Drone Physical Inspection",
    description: "Check the physical condition of the drone",
    items: [
      {
        id: "physical-1",
        title: "Propellers",
        description: "Check for cracks, deformities, or loose propellers",
        category: "Physical",
        required: true
      },
      {
        id: "physical-2",
        title: "Frame",
        description: "Inspect frame for damage or loose components",
        category: "Physical",
        required: true
      },
      {
        id: "physical-3",
        title: "Landing gear",
        description: "Verify landing gear is secure and undamaged",
        category: "Physical",
        required: true
      },
      {
        id: "physical-4",
        title: "Gimbal and camera",
        description: "Check camera mount and movement",
        category: "Physical",
        required: false
      }
    ]
  },
  {
    title: "Battery & Power",
    description: "Verify battery status and connections",
    items: [
      {
        id: "battery-1",
        title: "Battery charge",
        description: "Ensure battery is sufficiently charged (>80% recommended)",
        category: "Power",
        required: true
      },
      {
        id: "battery-2",
        title: "Battery condition",
        description: "Check for damage, swelling, or deformation",
        category: "Power",
        required: true
      },
      {
        id: "battery-3",
        title: "Connections",
        description: "Verify all power connections are secure",
        category: "Power",
        required: true
      }
    ]
  },
  {
    title: "Control System",
    description: "Verify controller and connection status",
    items: [
      {
        id: "control-1",
        title: "Remote controller",
        description: "Controller battery charged and functional",
        category: "Control",
        required: true
      },
      {
        id: "control-2",
        title: "Control link",
        description: "Verify controller connects to drone properly",
        category: "Control",
        required: true
      },
      {
        id: "control-3",
        title: "Flight modes",
        description: "Test different flight modes if available",
        category: "Control",
        required: false
      },
      {
        id: "control-4",
        title: "Return-to-home",
        description: "Verify RTH functionality is set up properly",
        category: "Control",
        required: true
      }
    ]
  },
  {
    title: "Environment & Regulations",
    description: "Check flight environment and regulatory compliance",
    items: [
      {
        id: "env-1",
        title: "Flight permissions",
        description: "Verify flight authorization for current location",
        category: "Regulation",
        required: true
      },
      {
        id: "env-2",
        title: "Obstacle check",
        description: "Survey area for trees, power lines, or buildings",
        category: "Environment",
        required: true
      },
      {
        id: "env-3",
        title: "People presence",
        description: "Ensure safe distance from uninvolved people",
        category: "Environment",
        required: true
      }
    ]
  }
];

const Index = () => {
  // States to track application data
  const [sectionProgress, setSectionProgress] = useState<Record<string, {passed: number, total: number}>>({});
  const [checklistProgress, setChecklistProgress] = useState(0);
  const [isWeatherGood, setIsWeatherGood] = useState(true);
  
  // Mock drone data (in a real app, this would come from device connection)
  const [droneData, setDroneData] = useState({
    batteryLevel: 85,
    signalStrength: 92,
    gpsStatus: 'strong' as 'strong' | 'weak' | 'no-signal'
  });
  
  // Mock weather data (in a real app, this would come from weather API)
  const [weatherData, setWeatherData] = useState({
    temperature: 22,
    windSpeed: 8,
    weatherType: 'sunny' as 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy',
    visibility: 5
  });
  
  // Handle section completion status changes
  const handleSectionStatusChange = (sectionTitle: string, passedCount: number, totalCount: number) => {
    setSectionProgress(prev => ({
      ...prev,
      [sectionTitle]: { passed: passedCount, total: totalCount }
    }));
  };
  
  // Handle weather status changes
  const handleWeatherStatusChange = (isGood: boolean) => {
    setIsWeatherGood(isGood);
  };
  
  // Calculate overall checklist progress
  useEffect(() => {
    if (Object.keys(sectionProgress).length === 0) return;
    
    const passedTotal = Object.values(sectionProgress).reduce((sum, section) => sum + section.passed, 0);
    const itemsTotal = Object.values(sectionProgress).reduce((sum, section) => sum + section.total, 0);
    
    const progress = Math.round((passedTotal / itemsTotal) * 100);
    setChecklistProgress(progress);
  }, [sectionProgress]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <DroneHeader />
        
        <DroneDashboard
          batteryLevel={droneData.batteryLevel}
          signalStrength={droneData.signalStrength}
          gpsStatus={droneData.gpsStatus}
          checklistProgress={checklistProgress}
        />
        
        <WeatherConditions
          temperature={weatherData.temperature}
          windSpeed={weatherData.windSpeed}
          weatherType={weatherData.weatherType}
          visibility={weatherData.visibility}
          onWeatherStatusChange={handleWeatherStatusChange}
        />
        
        <h2 className="text-2xl font-bold mb-5">Pre-Flight Checklist</h2>
        
        {checklistSections.map((section) => (
          <ChecklistSection
            key={section.title}
            title={section.title}
            description={section.description}
            items={section.items}
            onSectionStatusChange={handleSectionStatusChange}
          />
        ))}
        
        <div className="mt-8 mb-6 flex justify-center">
          <button
            className={`px-8 py-3 rounded-lg text-lg font-medium transition-all ${
              checklistProgress === 100 && isWeatherGood
                ? 'bg-success hover:bg-success/90 text-success-foreground'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            disabled={checklistProgress !== 100 || !isWeatherGood}
          >
            Confirm Ready for Flight
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
