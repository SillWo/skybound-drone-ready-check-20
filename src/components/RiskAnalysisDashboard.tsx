
import { useState } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faWind, 
  faCloud, 
  faBolt, 
  faBatteryHalf, 
  faSignal,
  faLocationDot
} from '@fortawesome/free-solid-svg-icons';

interface RiskFactor {
  id: string;
  name: string;
  icon: any;
  level: 'low' | 'medium' | 'high';
  description: string;
  value: number; // 0-100
}

export function RiskAnalysisDashboard() {
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    {
      id: 'wind',
      name: 'Ветер',
      icon: faWind,
      level: 'medium',
      description: 'Скорость ветра 5 м/с',
      value: 50
    },
    {
      id: 'visibility',
      name: 'Видимость',
      icon: faCloud,
      level: 'low',
      description: 'Хорошая видимость, незначительная облачность',
      value: 15
    },
    {
      id: 'storm',
      name: 'Грозовая активность',
      icon: faBolt,
      level: 'low',
      description: 'Грозовая активность не обнаружена',
      value: 5
    },
    {
      id: 'battery',
      name: 'Заряд батареи',
      icon: faBatteryHalf,
      level: 'low',
      description: 'Уровень заряда 75%',
      value: 25
    },
    {
      id: 'signal',
      name: 'Сигнал',
      icon: faSignal,
      level: 'medium',
      description: 'Средний уровень сигнала 75%',
      value: 40
    },
    {
      id: 'gps',
      name: 'GPS покрытие',
      icon: faLocationDot,
      level: 'low',
      description: 'Сильный сигнал GPS',
      value: 10
    }
  ]);

  const overallRiskPercentage = Math.round(
    riskFactors.reduce((sum, factor) => sum + factor.value, 0) / riskFactors.length
  );

  const getRiskLevel = (percentage: number) => {
    if (percentage < 33) return { level: 'low', text: 'Низкий', color: 'text-green-500', bgColor: 'bg-green-500' };
    if (percentage < 66) return { level: 'medium', text: 'Средний', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    return { level: 'high', text: 'Высокий', color: 'text-red-500', bgColor: 'bg-red-500' };
  };

  const overallRisk = getRiskLevel(overallRiskPercentage);

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-md p-4 mb-8">
      <div className="mb-6">
        <h2 className="font-mono text-xl font-medium mb-2">Анализ рисков запуска БАС</h2>
        <p className="text-gray-500 text-sm font-mono">Оценка текущих рисков полёта основана на погодных условиях и состоянии дрона</p>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="font-mono">Общий уровень риска:</div>
          <div className={`font-mono font-medium ${overallRisk.color}`}>{overallRisk.text} ({overallRiskPercentage}%)</div>
        </div>
        <Progress value={overallRiskPercentage} className="h-2" indicatorClassName={overallRisk.bgColor} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {riskFactors.map(factor => {
          const riskInfo = getRiskLevel(factor.value);
          return (
            <Card key={factor.id} className="border border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={factor.icon} className="h-4 w-4 text-gray-600" />
                    <CardTitle className="text-base font-mono">{factor.name}</CardTitle>
                  </div>
                  <div className={`text-sm font-medium ${riskInfo.color}`}>
                    {riskInfo.text}
                  </div>
                </div>
                <CardDescription className="text-xs font-mono">{factor.description}</CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <Progress value={factor.value} className="h-1.5" indicatorClassName={getRiskColor(factor.level)} />
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
        <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-amber-500 mt-0.5" />
        <div>
          <h3 className="font-mono font-medium mb-1">Рекомендации</h3>
          <p className="font-mono text-sm text-amber-800">
            Присутствуют факторы среднего риска. Рекомендуется внимательно следить за изменениями погодных условий и состоянием батареи во время полета.
          </p>
        </div>
      </div>
    </div>
  );
}
