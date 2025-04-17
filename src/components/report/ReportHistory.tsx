
import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileDownload, 
  faTrash, 
  faEye,
  faFileCode,
  faFilePdf,
  faFilter,
  faCalendarAlt,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/button';
import { SavedReport } from '@/types/report';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { exportToPdf, exportToJson } from '@/utils/export-utils';
import { ScrollArea } from '../ui/scroll-area';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';

interface ReportHistoryProps {
  reports: SavedReport[];
  onViewReport: (report: SavedReport) => void;
  onDeleteReport: (reportId: string) => void;
}

export function ReportHistory({ reports, onViewReport, onDeleteReport }: ReportHistoryProps) {
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);
  
  // Filter states
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [progressRange, setProgressRange] = useState<[number, number]>([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  
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

  // Clear filters
  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setProgressRange([0, 100]);
  };

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Filter by date
      const reportDate = parseISO(report.date);
      const passesDateFrom = !dateFrom || !isAfter(dateFrom, reportDate);
      const passesDateTo = !dateTo || !isBefore(dateTo, reportDate);
      
      // Filter by progress
      const passesProgress = 
        report.totalProgress >= progressRange[0] && 
        report.totalProgress <= progressRange[1];
      
      return passesDateFrom && passesDateTo && passesProgress;
    });
  }, [reports, dateFrom, dateTo, progressRange]);

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
            <DialogTitle className="flex justify-between items-center">
              <span>История отчетов</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
                Фильтры
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {showFilters && (
            <div className="p-4 border rounded-md mb-4 space-y-4">
              <h3 className="font-medium mb-2">Фильтрация отчетов</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateFrom">Дата от:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, 'PPP', { locale: ru }) : "Выберите дату"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="dateTo">Дата до:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-1"
                      >
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, 'PPP', { locale: ru }) : "Выберите дату"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label>Прогресс: {progressRange[0]}% - {progressRange[1]}%</Label>
                  <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-gray-500" />
                </div>
                <Slider
                  value={progressRange}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setProgressRange(value as [number, number])}
                  className="mt-2"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Сбросить фильтры
                </Button>
              </div>
            </div>
          )}
          
          <div className="pt-4">
            {filteredReports.length === 0 ? (
              <div className="text-center text-gray-500 my-4">
                {reports.length === 0 ? 
                  "История отчетов пуста" : 
                  "Нет отчетов, соответствующих выбранным фильтрам"}
              </div>
            ) : (
              <ScrollArea className="h-[60vh]">
                <div className="space-y-2">
                  {filteredReports.map((report) => (
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
