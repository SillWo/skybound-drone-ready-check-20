
import { useState } from 'react';
import { Sun, Cloud, CloudRain, Wind, ThermometerSun, CloudLightning, CloudSnow } from 'lucide-react';
import { cn } from '@/lib/utils';

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';

interface WeatherConditionsProps {
  temperature: number; // celsius
  windSpeed: number; // km/h
  weatherType: WeatherType;
  visibility: number; // km
  onWeatherStatusChange: (isGood: boolean) => void;
}

export function WeatherConditions({
  temperature,
  windSpeed,
  weatherType,
  visibility,
  onWeatherStatusChange
}: WeatherConditionsProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Weather evaluation logic
  const isTemperatureOk = temperature > 0 && temperature < 40;
  const isWindOk = windSpeed < 20;
  const isWeatherTypeOk = ['sunny', 'cloudy'].includes(weatherType);
  const isVisibilityOk = visibility > 1;
  
  const isWeatherGood = isTemperatureOk && isWindOk && isWeatherTypeOk && isVisibilityOk;
  
  // Call the status change handler whenever the weather conditions change
  useState(() => {
    onWeatherStatusChange(isWeatherGood);
  });
  
  const getWeatherIcon = () => {
    switch (weatherType) {
      case 'sunny': return <Sun className="h-6 w-6 text-warning" />;
      case 'cloudy': return <Cloud className="h-6 w-6 text-muted-foreground" />;
      case 'rainy': return <CloudRain className="h-6 w-6 text-primary" />;
      case 'stormy': return <CloudLightning className="h-6 w-6 text-destructive" />;
      case 'snowy': return <CloudSnow className="h-6 w-6 text-muted" />;
    }
  };
  
  const getStatusIndicator = (isOk: boolean) => {
    return (
      <div className={cn(
        "w-3 h-3 rounded-full",
        isOk ? "bg-success" : "bg-destructive"
      )}></div>
    );
  };

  return (
    <div className="bg-card shadow-sm rounded-lg p-5 mb-6 transition-all">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          {getWeatherIcon()}
          <h2 className="text-xl font-semibold">Weather Conditions</h2>
        </div>
        
        <div className={cn(
          "px-3 py-1 rounded-full text-sm font-medium",
          isWeatherGood ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
        )}>
          {isWeatherGood ? 'Suitable for flight' : 'Unfavorable conditions'}
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <ThermometerSun className="h-5 w-5 text-muted-foreground" />
              <span>Temperature</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{temperature}°C</span>
              {getStatusIndicator(isTemperatureOk)}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-muted-foreground" />
              <span>Wind Speed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{windSpeed} km/h</span>
              {getStatusIndicator(isWindOk)}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              {getWeatherIcon()}
              <span>Conditions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium capitalize">{weatherType}</span>
              {getStatusIndicator(isWeatherTypeOk)}
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-muted-foreground" />
              <span>Visibility</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{visibility} km</span>
              {getStatusIndicator(isVisibilityOk)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
