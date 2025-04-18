
import { DroneHeader } from '@/components/DroneHeader';
import { ReportConstructor as ReportForm } from '@/components/report/ReportConstructor';
import { WelcomeMessage } from '@/components/report/WelcomeMessage';
import { useState } from 'react';
import { Report } from '@/types/report';
import { createDefaultTemplate } from '@/utils/default-report-template';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ReportConstructor = () => {
  const [currentReport, setCurrentReport] = useState<Report | undefined>(createDefaultTemplate());

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

        {!currentReport ? (
          <WelcomeMessage />
        ) : (
          <ReportForm 
            initialReport={currentReport} 
            onSaveReport={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default ReportConstructor;
