
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskFactorsChart } from './RiskFactorsChart';
import { RiskMatrix } from './RiskMatrix';
import { RiskAssessmentForm } from './RiskAssessmentForm';
import { RiskMitigationChecklist } from './RiskMitigationChecklist';

export interface RiskFactor {
  id: string;
  category: string;
  name: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  score: number; // likelihood * impact
  mitigationStatus: 'not-started' | 'in-progress' | 'completed';
}

export function RiskAnalysisDashboard() {
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    {
      id: '1',
      category: 'Погода',
      name: 'Сильный ветер',
      likelihood: 3,
      impact: 4,
      score: 12,
      mitigationStatus: 'in-progress'
    },
    {
      id: '2',
      category: 'Техника',
      name: 'Выход из строя аккумулятора',
      likelihood: 2,
      impact: 5,
      score: 10,
      mitigationStatus: 'completed'
    },
    {
      id: '3',
      category: 'Окружение',
      name: 'Преграды в зоне полета',
      likelihood: 4,
      impact: 3,
      score: 12,
      mitigationStatus: 'not-started'
    },
    {
      id: '4',
      category: 'Окружение',
      name: 'Люди в зоне полета',
      likelihood: 2,
      impact: 5,
      score: 10,
      mitigationStatus: 'completed'
    },
    {
      id: '5',
      category: 'Техника',
      name: 'Проблемы с GPS',
      likelihood: 3,
      impact: 4,
      score: 12,
      mitigationStatus: 'not-started'
    },
    {
      id: '6',
      category: 'Погода',
      name: 'Осадки',
      likelihood: 2,
      impact: 3,
      score: 6,
      mitigationStatus: 'completed'
    }
  ]);

  const updateRiskFactor = (updatedFactor: RiskFactor) => {
    setRiskFactors(prev => 
      prev.map(factor => 
        factor.id === updatedFactor.id ? updatedFactor : factor
      )
    );
  };

  const addRiskFactor = (newFactor: Omit<RiskFactor, 'id' | 'score'>) => {
    const id = (riskFactors.length + 1).toString();
    const score = newFactor.likelihood * newFactor.impact;
    
    setRiskFactors(prev => [...prev, { ...newFactor, id, score }]);
  };

  // Calculate overall risk score
  const calculateOverallRisk = () => {
    if (riskFactors.length === 0) return 0;
    
    const totalScore = riskFactors.reduce((sum, factor) => sum + factor.score, 0);
    return Math.round(totalScore / riskFactors.length);
  };

  // Get risk level
  const getRiskLevel = (score: number) => {
    if (score <= 4) return { level: 'Низкий', color: 'text-green-500' };
    if (score <= 9) return { level: 'Средний', color: 'text-yellow-500' };
    if (score <= 14) return { level: 'Высокий', color: 'text-orange-500' };
    return { level: 'Критический', color: 'text-red-500' };
  };

  const overallRisk = calculateOverallRisk();
  const riskLevel = getRiskLevel(overallRisk);
  
  // Calculate mitigation progress
  const mitigationProgress = () => {
    const completed = riskFactors.filter(f => f.mitigationStatus === 'completed').length;
    return Math.round((completed / riskFactors.length) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Общий риск</CardTitle>
            <CardDescription>Средневзвешенная оценка</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-24">
              <div className={`text-4xl font-bold ${riskLevel.color}`}>
                {overallRisk}
              </div>
              <div className={`text-sm font-medium ${riskLevel.color}`}>
                {riskLevel.level}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Критические риски</CardTitle>
            <CardDescription>Требуют немедленного внимания</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-24">
              <div className="text-4xl font-bold text-red-500">
                {riskFactors.filter(f => f.score >= 15).length}
              </div>
              <div className="text-sm font-medium">
                факторов
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Прогресс снижения</CardTitle>
            <CardDescription>Меры по снижению рисков</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-24">
              <div className="text-4xl font-bold text-blue-500">
                {mitigationProgress()}%
              </div>
              <div className="text-sm font-medium">
                выполнено
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="matrix" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-4">
          <TabsTrigger value="matrix">Матрица рисков</TabsTrigger>
          <TabsTrigger value="factors">Факторы риска</TabsTrigger>
          <TabsTrigger value="assessment">Оценка</TabsTrigger>
          <TabsTrigger value="mitigation">Снижение</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle>Матрица рисков</CardTitle>
              <CardDescription>
                Визуальное представление рисков по вероятности и воздействию
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskMatrix riskFactors={riskFactors} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="factors">
          <Card>
            <CardHeader>
              <CardTitle>Распределение факторов риска</CardTitle>
              <CardDescription>
                Распределение рисков по категориям
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskFactorsChart riskFactors={riskFactors} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle>Оценка нового риска</CardTitle>
              <CardDescription>
                Добавьте новый фактор риска для анализа
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskAssessmentForm onAddRiskFactor={addRiskFactor} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mitigation">
          <Card>
            <CardHeader>
              <CardTitle>Меры по снижению рисков</CardTitle>
              <CardDescription>
                Управление мерами по снижению выявленных рисков
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskMitigationChecklist 
                riskFactors={riskFactors} 
                onUpdateRiskFactor={updateRiskFactor} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
