
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ReportConstructor } from './ReportConstructor';
import { ReportHistory } from './ReportHistory';
import { WelcomeMessage } from './WelcomeMessage';
import { Report, SavedReport } from '@/types/report';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHistory } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { createDefaultTemplate } from '@/utils/default-report-template';

interface ReportManagerProps {
  droneData: {
    batteryLevel: number;
    signalStrength: number;
    gpsStatus: 'strong' | 'weak' | 'no-signal';
    checklistProgress: number;
  };
  onProgressUpdate: (progress: number) => void;
}

export function ReportManager({ droneData, onProgressUpdate }: ReportManagerProps) {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [showNewReportDialog, setShowNewReportDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  
  // Load reports from localStorage on mount
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
  
  // Save reports to localStorage
  const saveReportsToStorage = (updatedReports: SavedReport[]) => {
    try {
      localStorage.setItem('droneReports', JSON.stringify(updatedReports));
    } catch (e) {
      console.error('Error saving reports:', e);
    }
  };
  
  // Handle saving a report
  const handleSaveReport = (report: Report) => {
    // Update the drone data progress based on the report progress
    onProgressUpdate(report.totalProgress);
    
    // Create SavedReport with drone and weather data
    const savedReport: SavedReport = {
      ...report,
      droneData: {
        batteryLevel: droneData.batteryLevel,
        signalStrength: droneData.signalStrength,
        gpsStatus: droneData.gpsStatus
      },
      weatherData: {
        temperature: 22, // Mock data
        windSpeed: 5, // Mock data
        visibility: 'Хорошая', // Mock data
        isGoodWeather: true // Mock data
      }
    };
    
    // Check if this is an update to an existing report
    const existingReportIndex = reports.findIndex(r => r.id === report.id);
    
    let updatedReports: SavedReport[];
    if (existingReportIndex >= 0) {
      // Update existing report
      updatedReports = [
        ...reports.slice(0, existingReportIndex),
        savedReport,
        ...reports.slice(existingReportIndex + 1)
      ];
    } else {
      // Add new report
      updatedReports = [...reports, savedReport];
    }
    
    setReports(updatedReports);
    saveReportsToStorage(updatedReports);
    setCurrentReport(report);
    setShowNewReportDialog(false);
  };
  
  // Handle view saved report
  const handleViewReport = (report: SavedReport) => {
    setCurrentReport(report);
    setShowHistoryDialog(false);
    setShowNewReportDialog(true);
  };
  
  // Handle delete report
  const handleDeleteReport = (reportId: string) => {
    const updatedReports = reports.filter(report => report.id !== reportId);
    setReports(updatedReports);
    saveReportsToStorage(updatedReports);
    
    if (currentReport?.id === reportId) {
      setCurrentReport(null);
    }
  };
  
  // Create new report
  const handleCreateNewReport = () => {
    // Use the default template as a starting point
    setCurrentReport(createDefaultTemplate());
    setShowNewReportDialog(true);
  };
  
  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <Button 
          variant="outline" 
          onClick={handleCreateNewReport}
          className="font-mono flex items-center gap-1"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
          Новый отчет
        </Button>
        
        <ReportHistory 
          reports={reports} 
          onViewReport={handleViewReport} 
          onDeleteReport={handleDeleteReport} 
        />
      </div>
      
      {reports.length === 0 && !currentReport && (
        <WelcomeMessage />
      )}
      
      <Dialog open={showNewReportDialog} onOpenChange={setShowNewReportDialog}>
        <DialogContent className="font-mono max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentReport ? `Редактирование: ${currentReport.title}` : 'Новый отчет'}
            </DialogTitle>
          </DialogHeader>
          
          <ReportConstructor 
            initialReport={currentReport || undefined}
            onSaveReport={handleSaveReport}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
