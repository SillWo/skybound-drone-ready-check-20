
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBatteryFull, 
  faSignal, 
  faLocationArrow, 
  faClipboardCheck,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';

interface MinimalistDroneDashboardProps {
  batteryLevel: number;
  signalStrength: number;
  gpsStatus: 'strong' | 'weak' | 'no-signal';
  checklistProgress: number;
}

export function MinimalistDroneDashboard({
  batteryLevel,
  signalStrength,
  gpsStatus,
  checklistProgress
}: MinimalistDroneDashboardProps) {
  
  const getGpsText = () => {
    switch (gpsStatus) {
      case 'strong': return 'Сильный сигнал';
      case 'weak': return 'Слабый сигнал';
      default: return 'Нет сигнала';
    }
  };
  
  const isChecklistComplete = checklistProgress === 100;
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-mono mb-4">miniSIGMA</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-gray-200 rounded-md p-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBatteryFull} className="h-5 w-5 text-gray-700" />
              <span className="text-sm font-mono">Батарея</span>
            </div>
            <span className="text-sm font-mono font-medium">{batteryLevel}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-300 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${batteryLevel}%` }}
            />
          </div>
        </div>
        
        <div className="bg-gray-200 rounded-md p-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faSignal} className="h-5 w-5 text-gray-700" />
              <span className="text-sm font-mono">Сигнал</span>
            </div>
            <span className="text-sm font-mono font-medium">{signalStrength}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-300 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${signalStrength}%` }}
            />
          </div>
        </div>
        
        <div className="bg-gray-200 rounded-md p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationArrow} className="h-5 w-5 text-gray-700" />
              <span className="text-sm font-mono">GPS</span>
            </div>
          </div>
          <div className="mt-1">
            <span className={cn(
              "text-sm font-mono",
              gpsStatus === 'strong' && "text-green-600",
              gpsStatus === 'weak' && "text-yellow-600",
              gpsStatus === 'no-signal' && "text-red-600"
            )}>
              {getGpsText()}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-200 rounded-md p-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClipboardCheck} className="h-5 w-5 text-gray-700" />
              <span className="text-sm font-mono">Чек-лист</span>
            </div>
            <span className="text-sm font-mono font-medium">{checklistProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-300 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${checklistProgress}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className={cn(
        "w-full p-3 rounded-md text-center font-mono font-medium mt-4",
        isChecklistComplete ? "bg-green-500 text-white" : "bg-red-500 text-white"
      )}>
        {isChecklistComplete ? "Подготовка завершена!" : "Подготовка не завершена!"}
      </div>
    </div>
  );
}
