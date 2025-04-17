
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';

interface WeatherSectionProps {
  isGoodWeather: boolean;
}

export function WeatherSection({ isGoodWeather }: WeatherSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white shadow-sm rounded-md p-4 mb-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSun} className="h-5 w-5 text-gray-700" />
          <span className="text-base font-mono font-medium">Погодные условия</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-mono px-2 py-0.5 rounded",
            isGoodWeather ? "text-green-600" : "text-red-600"
          )}>
            {isGoodWeather ? "Подходит для полета" : "Не подходит для полета"}
          </span>
          {expanded ? (
            <FontAwesomeIcon icon={faChevronUp} className="h-5 w-5 text-gray-500" />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3 border-t pt-3">
          <div className="text-sm text-gray-600 font-mono">
            Temperature: 22°C, Wind: 5 km/h, Visibility: Good
          </div>
        </div>
      )}
    </div>
  );
}
