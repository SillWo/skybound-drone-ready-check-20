
import { DroneHeader } from '@/components/DroneHeader';
import { ReportHistory as ReportHistoryComponent } from '@/components/report/ReportHistory';
import { useState, useEffect } from 'react';
import { SavedReport } from '@/types/report';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ReportHistory = () => {
  const [reports, setReports] = useState<SavedReport[]>([]);

  useEffect(() => {
    const savedReports = localStorage.getItem('droneReports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {
        console.error('Error loading saved reports:', e);
      }
    }
  }, []);

  const handleDeleteReport = (reportId: string) => {
    const updatedReports = reports.filter(report => report.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem('droneReports', JSON.stringify(updatedReports));
  };

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

        <ReportHistoryComponent 
          reports={reports}
          onViewReport={() => {}}
          onDeleteReport={handleDeleteReport}
        />
      </div>
    </div>
  );
};

export default ReportHistory;
