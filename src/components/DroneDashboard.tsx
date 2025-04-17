
import { Battery, Wifi, Navigation, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DroneDashboardProps {
  batteryLevel: number; // 0-100
  signalStrength: number; // 0-100
  gpsStatus: 'strong' | 'weak' | 'no-signal';
  checklistProgress: number; // 0-100
}

export function DroneDashboard({
  batteryLevel,
  signalStrength,
  gpsStatus,
  checklistProgress
}: DroneDashboardProps) {
  
  const getBatteryColor = () => {
    if (batteryLevel > 50) return 'text-success';
    if (batteryLevel > 20) return 'text-warning';
    return 'text-destructive';
  };
  
  const getSignalColor = () => {
    if (signalStrength > 70) return 'text-success';
    if (signalStrength > 30) return 'text-warning';
    return 'text-destructive';
  };
  
  const getGpsColor = () => {
    if (gpsStatus === 'strong') return 'text-success';
    if (gpsStatus === 'weak') return 'text-warning';
    return 'text-destructive';
  };
  
  const getFlightReadiness = () => {
    if (
      batteryLevel > 20 && 
      signalStrength > 30 && 
      gpsStatus !== 'no-signal' && 
      checklistProgress === 100
    ) {
      return {
        status: 'Ready for flight',
        color: 'bg-success text-success-foreground'
      };
    } else if (
      batteryLevel > 10 && 
      signalStrength > 20 && 
      checklistProgress >= 80
    ) {
      return {
        status: 'Almost ready',
        color: 'bg-warning text-warning-foreground'
      };
    } else {
      return {
        status: 'Not ready for flight',
        color: 'bg-destructive text-destructive-foreground'
      };
    }
  };
  
  const readiness = getFlightReadiness();

  return (
    <div className="bg-card shadow-sm rounded-lg p-5 mb-6">
      <h2 className="text-xl font-semibold mb-4">Drone Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Battery</span>
            <Battery className={cn("h-5 w-5", getBatteryColor())} />
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all", 
                batteryLevel > 50 ? "bg-success" : 
                batteryLevel > 20 ? "bg-warning" : "bg-destructive"
              )} 
              style={{ width: `${batteryLevel}%` }}
            />
          </div>
          <div className="mt-1 text-right text-sm font-bold">{batteryLevel}%</div>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Signal</span>
            <Wifi className={cn("h-5 w-5", getSignalColor())} />
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all", 
                signalStrength > 70 ? "bg-success" : 
                signalStrength > 30 ? "bg-warning" : "bg-destructive"
              )} 
              style={{ width: `${signalStrength}%` }}
            />
          </div>
          <div className="mt-1 text-right text-sm font-bold">{signalStrength}%</div>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">GPS</span>
            <Navigation className={cn("h-5 w-5", getGpsColor())} />
          </div>
          <div className="flex items-center justify-center h-8">
            <span className={cn(
              "font-medium",
              gpsStatus === 'strong' ? "text-success" : 
              gpsStatus === 'weak' ? "text-warning" : "text-destructive" 
            )}>
              {gpsStatus === 'strong' ? 'Strong Signal' : 
               gpsStatus === 'weak' ? 'Weak Signal' : 'No Signal'}
            </span>
          </div>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Checklist</span>
            <AlertTriangle className={cn(
              "h-5 w-5",
              checklistProgress === 100 ? "text-success" : 
              checklistProgress >= 80 ? "text-warning" : "text-muted-foreground"
            )} />
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all", 
                checklistProgress === 100 ? "bg-success" : 
                checklistProgress >= 80 ? "bg-warning" : "bg-primary"
              )} 
              style={{ width: `${checklistProgress}%` }}
            />
          </div>
          <div className="mt-1 text-right text-sm font-bold">{checklistProgress}%</div>
        </div>
      </div>
      
      <div className={cn(
        "w-full p-3 rounded-lg text-center font-medium",
        readiness.color
      )}>
        {readiness.status}
      </div>
    </div>
  );
}
