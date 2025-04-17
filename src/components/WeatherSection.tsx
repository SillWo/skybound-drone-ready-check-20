
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun, 
  faCloud, 
  faCloudRain, 
  faCloudBolt, 
  faSnowflake,
  faChevronDown, 
  faChevronUp, 
  faWind, 
  faTemperatureHigh,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import { fetchWeatherData } from '@/services/weatherService';

interface WeatherSectionProps {
  isGoodWeather?: boolean;
}

export function WeatherSection({ isGoodWeather: initialIsGoodWeather }: WeatherSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    windSpeed: 0,
    weatherType: 'sunny' as 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy',
    visibility: 0,
    isGoodWeather: initialIsGoodWeather || false
  });

  useEffect(() => {
    async function loadWeatherData() {
      setIsLoading(true);
      try {
        const data = await fetchWeatherData();
        setWeatherData(data);
      } catch (error) {
        console.error("Failed to load weather data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadWeatherData();
    
    // Обновлять погоду каждые 30 минут
    const interval = setInterval(loadWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    switch (weatherData.weatherType) {
      case 'sunny': return <FontAwesomeIcon icon={faSun} className="h-5 w-5 text-yellow-500" />;
      case 'cloudy': return <FontAwesomeIcon icon={faCloud} className="h-5 w-5 text-gray-500" />;
      case 'rainy': return <FontAwesomeIcon icon={faCloudRain} className="h-5 w-5 text-blue-500" />;
      case 'stormy': return <FontAwesomeIcon icon={faCloudBolt} className="h-5 w-5 text-purple-500" />;
      case 'snowy': return <FontAwesomeIcon icon={faSnowflake} className="h-5 w-5 text-blue-300" />;
      default: return <FontAwesomeIcon icon={faSun} className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getWeatherTypeName = () => {
    switch (weatherData.weatherType) {
      case 'sunny': return 'Ясно';
      case 'cloudy': return 'Облачно';
      case 'rainy': return 'Дождь';
      case 'stormy': return 'Гроза';
      case 'snowy': return 'Снег';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-md p-4 mb-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
          ) : (
            getWeatherIcon()
          )}
          <span className="text-base font-mono font-medium">Погодные условия</span>
          <span className="text-xs font-mono text-gray-500">Красноярск</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <span className={cn(
              "text-sm font-mono px-2 py-0.5 rounded",
              weatherData.isGoodWeather ? "text-green-600" : "text-red-600"
            )}>
              {weatherData.isGoodWeather ? "Подходит для полета" : "Не подходит для полета"}
            </span>
          )}
          {expanded ? (
            <FontAwesomeIcon icon={faChevronUp} className="h-5 w-5 text-gray-500" />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="mt-3 border-t pt-3">
          {isLoading ? (
            <div className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center text-sm text-gray-600 font-mono gap-2">
                <FontAwesomeIcon icon={faTemperatureHigh} className="h-4 w-4 text-gray-500" />
                <span>Температура: {weatherData.temperature}°C</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 font-mono gap-2">
                <FontAwesomeIcon icon={faWind} className="h-4 w-4 text-gray-500" />
                <span>Ветер: {weatherData.windSpeed} м/с</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 font-mono gap-2">
                {getWeatherIcon()}
                <span>Условия: {getWeatherTypeName()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 font-mono gap-2">
                <FontAwesomeIcon icon={faEye} className="h-4 w-4 text-gray-500" />
                <span>Видимость: {weatherData.visibility} км</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
