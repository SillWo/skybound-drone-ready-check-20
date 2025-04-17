
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileDownload, 
  faTrash, 
  faEye,
  faFileCode,
  faFilePdf 
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/button';
import { SavedReport } from '@/types/report';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { exportToPdf, exportToJson } from '@/utils/export-utils';
import { ScrollArea } from '../ui/scroll-area';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { cn } from '@/lib/utils';

interface ReportHistoryProps {
  reports: SavedReport[];
  onViewReport: (report: SavedReport) => void;
  onDeleteReport: (reportId: string) => void;
}

export function ReportHistory({ reports, onViewReport, onDeleteReport }: ReportHistoryProps) {
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);
  
  // Open report details
  const openReportDetails = (report: SavedReport) => {
    setSelectedReport(report);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: ru });
    } catch {
      return dateString;
    }
  };
  
  // Handle export to PDF
  const handleExportToPdf = (report: SavedReport) => {
    exportToPdf(report);
  };
  
  // Handle export to JSON
  const handleExportToJson = (report: SavedReport) => {
    exportToJson(report);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setShowHistoryDialog(true)}
        className="font-mono"
      >
        История отчетов
      </Button>
      
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="font-mono max-w-3xl">
          <DialogHeader>
            <DialogTitle>История отчетов</DialogTitle>
          </DialogHeader>
          
          <div className="pt-4">
            {reports.length === 0 ? (
              <div className="text-center text-gray-500 my-4">
                История отчетов пуста
              </div>
            ) : (
              <ScrollArea className="h-[60vh]">
                <div className="space-y-2">
                  {reports.map((report) => (
                    <div 
                      key={report.id} 
                      className="p-3 border rounded-md"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{report.title}</h4>
                          <p className="text-sm text-gray-500">{formatDate(report.date)}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleExportToPdf(report)}
                            title="Экспорт в PDF"
                          >
                            <FontAwesomeIcon icon={faFilePdf} className="h-4 w-4 text-red-500" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleExportToJson(report)}
                            title="Экспорт в JSON"
                          >
                            <FontAwesomeIcon icon={faFileCode} className="h-4 w-4 text-blue-500" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onViewReport(report)}
                            title="Открыть отчет"
                          >
                            <FontAwesomeIcon icon={faEye} className="h-4 w-4 text-green-500" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onDeleteReport(report.id)}
                            title="Удалить отчет"
                          >
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className={cn(
                            "px-2 py-0.5 rounded",
                            report.totalProgress === 100 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          )}>
                            Прогресс: {report.totalProgress}%
                          </span>
                          
                          <span className="text-gray-500">
                            {report.sections.length} разделов
                          </span>
                          
                          <span className="text-gray-500">
                            {report.sections.reduce((total, section) => total + section.items.length, 0)} пунктов
                          </span>
                        </div>
                      </div>
                      
                      {selectedReport?.id === report.id && (
                        <div className="mt-3 pt-3 border-t">
                          <h5 className="font-medium text-sm mb-2">Содержание отчета:</h5>
                          
                          {report.sections.map((section) => (
                            <div key={section.id} className="mb-2">
                              <div className="text-sm font-medium">{section.title}</div>
                              <div className="text-xs text-gray-500">{section.location}</div>
                              
                              <ul className="mt-1 pl-4 text-xs">
                                {section.items.map((item) => (
                                  <li 
                                    key={item.id}
                                    className={cn(
                                      "py-0.5",
                                      item.checked ? "text-green-600" : "text-gray-600"
                                    )}
                                  >
                                    {item.label}
                                    {item.comment && (
                                      <div className="text-xs text-blue-500 pl-2">
                                        Комментарий: {item.comment}
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-2 text-right">
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => openReportDetails(report)}
                          className="h-auto p-0 text-xs"
                        >
                          {selectedReport?.id === report.id ? 'Скрыть детали' : 'Показать детали'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
