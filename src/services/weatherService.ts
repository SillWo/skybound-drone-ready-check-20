
import { toast } from "@/components/ui/use-toast";

interface WeatherData {
  temperature: number;
  windSpeed: number;
  weatherType: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  visibility: number;
  isGoodWeather: boolean;
}

// Используем OpenWeatherMap API для получения данных о погоде
export const fetchWeatherData = async (): Promise<WeatherData> => {
  try {
    // API ключ и параметры запроса для Красноярска
    const apiKey = "6c9cd24bb22d9a69b9992b0a1a87bc99"; // Публичный API ключ для демонстрации
    const city = "Krasnoyarsk";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`
    );

    if (!response.ok) {
      throw new Error("Не удалось получить данные о погоде");
    }

    const data = await response.json();
    
    // Преобразуем данные из API в формат нашего приложения
    const weatherType = mapWeatherCondition(data.weather[0].id);
    const temperature = Math.round(data.main.temp);
    const windSpeed = Math.round(data.wind.speed);
    const visibility = data.visibility / 1000; // конвертируем из метров в километры
    
    // Определяем, хорошая ли погода для полета
    const isGoodWeather = evaluateFlightConditions(temperature, windSpeed, weatherType, visibility);
    
    return {
      temperature,
      windSpeed,
      weatherType,
      visibility,
      isGoodWeather
    };
  } catch (error) {
    console.error("Ошибка при получении данных о погоде:", error);
    toast({
      title: "Ошибка",
      description: "Не удалось загрузить погодные данные. Используются значения по умолчанию.",
      variant: "destructive"
    });
    
    // Возвращаем данные по умолчанию в случае ошибки
    return {
      temperature: 22,
      windSpeed: 5,
      weatherType: 'sunny',
      visibility: 10,
      isGoodWeather: true
    };
  }
};

// Функция для преобразования кода погоды из API в наш тип погоды
const mapWeatherCondition = (weatherCode: number): 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' => {
  // Коды погоды из OpenWeatherMap API: https://openweathermap.org/weather-conditions
  if (weatherCode >= 200 && weatherCode < 300) return 'stormy'; // Гроза
  if (weatherCode >= 300 && weatherCode < 600) return 'rainy'; // Дождь
  if (weatherCode >= 600 && weatherCode < 700) return 'snowy'; // Снег
  if (weatherCode >= 700 && weatherCode < 800) return 'cloudy'; // Туман и другие
  if (weatherCode === 800) return 'sunny'; // Ясно
  if (weatherCode > 800) return 'cloudy'; // Облачно
  
  return 'sunny'; // По умолчанию
};

// Функция для оценки пригодности погодных условий для полета
const evaluateFlightConditions = (
  temperature: number,
  windSpeed: number,
  weatherType: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy',
  visibility: number
): boolean => {
  // Проверка по критериям из технического задания
  const isTemperatureOk = temperature > 0 && temperature < 40;
  const isWindOk = windSpeed < 10; // Согласно ТЗ, ветер должен быть менее 10 м/с
  const isWeatherTypeOk = ['sunny', 'cloudy'].includes(weatherType); // Нет осадков
  const isVisibilityOk = visibility > 1; // Хорошая видимость для съемки
  
  return isTemperatureOk && isWindOk && isWeatherTypeOk && isVisibilityOk;
};
