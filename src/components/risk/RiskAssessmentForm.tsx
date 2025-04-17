
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RiskFactor } from './RiskAnalysisDashboard';

interface RiskAssessmentFormProps {
  onAddRiskFactor: (factor: Omit<RiskFactor, 'id' | 'score'>) => void;
}

export function RiskAssessmentForm({ onAddRiskFactor }: RiskAssessmentFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [likelihood, setLikelihood] = useState(3); // Default to medium
  const [impact, setImpact] = useState(3); // Default to medium
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCategory = showCustomCategory ? customCategory : category;
    
    if (!name || !selectedCategory) return;
    
    onAddRiskFactor({
      name,
      category: selectedCategory,
      likelihood,
      impact,
      mitigationStatus: 'not-started'
    });
    
    // Reset form
    setName('');
    setCategory('');
    setLikelihood(3);
    setImpact(3);
    setCustomCategory('');
    setShowCustomCategory(false);
  };

  const predefinedCategories = [
    'Погода',
    'Техника',
    'Окружение',
    'Персонал',
    'Процедуры',
    'Другое'
  ];

  // Get description based on value
  const getLikelihoodDescription = (value: number) => {
    switch (value) {
      case 1: return 'Очень низкая';
      case 2: return 'Низкая';
      case 3: return 'Средняя';
      case 4: return 'Высокая';
      case 5: return 'Очень высокая';
      default: return '';
    }
  };

  const getImpactDescription = (value: number) => {
    switch (value) {
      case 1: return 'Очень низкое';
      case 2: return 'Низкое';
      case 3: return 'Среднее';
      case 4: return 'Высокое';
      case 5: return 'Очень высокое';
      default: return '';
    }
  };

  // Calculate risk score and level
  const riskScore = likelihood * impact;
  
  const getRiskLevel = (score: number) => {
    if (score <= 4) return { level: 'Низкий', color: 'text-green-500' };
    if (score <= 9) return { level: 'Средний', color: 'text-yellow-500' };
    if (score <= 14) return { level: 'Высокий', color: 'text-orange-500' };
    return { level: 'Критический', color: 'text-red-500' };
  };
  
  const riskLevel = getRiskLevel(riskScore);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Название фактора риска</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите название фактора риска"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category">Категория</Label>
          {!showCustomCategory ? (
            <>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Своя категория...</SelectItem>
                </SelectContent>
              </Select>
              
              {category === 'custom' && (
                <div className="mt-2">
                  <Input
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Введите свою категорию"
                    onFocus={() => setShowCustomCategory(true)}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-2">
              <Input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Введите свою категорию"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowCustomCategory(false);
                  setCategory('');
                }}
              >
                Отмена
              </Button>
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="likelihood">Вероятность: {getLikelihoodDescription(likelihood)} ({likelihood})</Label>
          </div>
          <Slider
            id="likelihood"
            min={1}
            max={5}
            step={1}
            value={[likelihood]}
            onValueChange={(value) => setLikelihood(value[0])}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Очень низкая</span>
            <span>Очень высокая</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="impact">Воздействие: {getImpactDescription(impact)} ({impact})</Label>
          </div>
          <Slider
            id="impact"
            min={1}
            max={5}
            step={1}
            value={[impact]}
            onValueChange={(value) => setImpact(value[0])}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Очень низкое</span>
            <span>Очень высокое</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Общая оценка риска:</div>
            <div className={`text-lg font-bold ${riskLevel.color}`}>
              {riskScore} - {riskLevel.level}
            </div>
          </div>
          
          <Button type="submit">Добавить фактор риска</Button>
        </div>
      </div>
    </form>
  );
}
