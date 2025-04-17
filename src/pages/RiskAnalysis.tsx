
import { DroneHeader } from '@/components/DroneHeader';
import { RiskAnalysisDashboard } from '@/components/risk/RiskAnalysisDashboard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const RiskAnalysis = () => {
  return (
    <div className="min-h-screen bg-[#f0f0f0] p-2 sm:p-4 font-mono">
      <div className="max-w-4xl mx-auto">
        <DroneHeader />
        
        <div className="mb-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="font-mono flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Вернуться на главную
            </Button>
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Анализ рисков запуска БАС</h1>
        
        <RiskAnalysisDashboard />
      </div>
    </div>
  );
};

export default RiskAnalysis;
