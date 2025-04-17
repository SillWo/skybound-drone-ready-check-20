
import { RiskFactor } from './RiskAnalysisDashboard';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RiskMitigationChecklistProps {
  riskFactors: RiskFactor[];
  onUpdateRiskFactor: (factor: RiskFactor) => void;
}

export function RiskMitigationChecklist({ riskFactors, onUpdateRiskFactor }: RiskMitigationChecklistProps) {
  const [mitigationNotes, setMitigationNotes] = useState<Record<string, string>>({});

  // Sort risk factors by score (highest first)
  const sortedFactors = [...riskFactors].sort((a, b) => b.score - a.score);
  
  const handleStatusChange = (factorId: string, status: 'not-started' | 'in-progress' | 'completed') => {
    const factor = riskFactors.find(f => f.id === factorId);
    if (factor) {
      onUpdateRiskFactor({
        ...factor,
        mitigationStatus: status
      });
    }
  };
  
  const handleNoteChange = (factorId: string, note: string) => {
    setMitigationNotes(prev => ({
      ...prev,
      [factorId]: note
    }));
  };
  
  const saveNote = (factorId: string) => {
    // In a real app, you would save this note to your backend
    console.log(`Saving note for factor ${factorId}:`, mitigationNotes[factorId]);
  };
  
  // Get risk level class
  const getRiskLevelClass = (score: number) => {
    if (score <= 4) return 'bg-green-100 border-green-200';
    if (score <= 9) return 'bg-yellow-100 border-yellow-200';
    if (score <= 14) return 'bg-orange-100 border-orange-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <div className="space-y-4">
      {sortedFactors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Нет факторов риска для отображения
        </div>
      ) : (
        sortedFactors.map((factor) => (
          <div 
            key={factor.id} 
            className={cn(
              "border rounded-md p-4",
              getRiskLevelClass(factor.score)
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{factor.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white">
                    {factor.category}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  Оценка риска: <span className="font-medium">{factor.score}</span>
                  <span className="text-xs ml-2">
                    (Вероятность: {factor.likelihood}, Воздействие: {factor.impact})
                  </span>
                </div>
              </div>
              
              <div>
                <RadioGroup 
                  defaultValue={factor.mitigationStatus} 
                  onValueChange={(value) => handleStatusChange(
                    factor.id, 
                    value as 'not-started' | 'in-progress' | 'completed'
                  )}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-started" id={`not-started-${factor.id}`} />
                    <Label htmlFor={`not-started-${factor.id}`}>Не начато</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-progress" id={`in-progress-${factor.id}`} />
                    <Label htmlFor={`in-progress-${factor.id}`}>В процессе</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="completed" id={`completed-${factor.id}`} />
                    <Label htmlFor={`completed-${factor.id}`}>Завершено</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`note-${factor.id}`}>Меры по снижению риска</Label>
              <div className="flex gap-2">
                <Textarea
                  id={`note-${factor.id}`}
                  placeholder="Опишите предпринятые меры по снижению риска..."
                  value={mitigationNotes[factor.id] || ''}
                  onChange={(e) => handleNoteChange(factor.id, e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => saveNote(factor.id)}
                  variant="outline"
                >
                  Сохранить
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
