
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileDownload, 
  faTrash, 
  faEye,
  faFileCode,
  faFilePdf,
  faFilter,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/button';
import { SavedReport } from '@/types/report';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { exportToPdf, exportToJson } from '@/utils/export-utils';
import { ScrollArea } from '../ui/scroll-area';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Slider } from '../ui/slider';
import { Calendar } from '../ui/calendar';
import { Label } from '../ui/label';
import { toast } from '../ui/use-toast';

interface ReportHistoryProps {
  reports: SavedReport[];
  onViewReport: (report: SavedReport) => void;
  onDeleteReport: (reportId: string) => void;
}

export function ReportHistory({ reports, onViewReport, onDeleteReport }: ReportHistoryProps) {
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [filteredReports, setFilteredReports] = useState<SavedReport[]>(reports);
  
  // Filter states
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [progressRange, setProgressRange] = useState<number[]>([0, 100]);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  
  // Update filtered reports when reports or filters change
  useEffect(() => {
    let result = [...reports];
    
    // Filter by date range
    if (dateRange.from) {
      result = result.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate >= dateRange.from!;
      });
    }
    
    if (dateRange.to) {
      result = result.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate <= dateRange.to!;
      });
    }
    
    // Filter by progress range
    result = result.filter(report => 
      report.totalProgress >= progressRange[0] && 
      report.totalProgress <= progressRange[1]
    );
    
    // Sort by date, newest first
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredReports(result);
  }, [reports, dateRange, progressRange]);
  
  // Toggle report details
  const toggleReportDetails = (reportId: string) => {
    setSelectedReport(prev => prev === reportId ? null : reportId);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd MMMM yyyy, HH:mm', { locale: ru });
    } catch {
      return dateString;
    }
  };
  
  // Handle export to PDF
  const handleExportToPdf = async (report: SavedReport) => {
    toast({
      title: "Создание PDF",
      description: "Пожалуйста, подождите, PDF файл создается...",
    });
    
    try {
      await exportToPdf(report);
      
      toast({
        title: "PDF создан",
        description: "PDF файл успешно создан и скачан",
      });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать PDF файл",
        variant: "destructive"
      });
    }
  };
  
  // Handle export to JSON
  const handleExportToJson = (report: SavedReport) => {
    exportToJson(report);
  };
  
  // Reset filters
  const resetFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setProgressRange([0, 100]);
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
            <DialogDescription>
              Управляйте и просматривайте сохраненные отчеты
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              {filteredReports.length} отчетов найдено
            </div>
            
            <Popover open={showFilterPopover} onOpenChange={setShowFilterPopover}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faFilter} className="h-3 w-3 mr-1" />
                  Фильтры
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium mb-2">Фильтры отчетов</h4>
                  
                  <div className="space-y-2">
                    <Label>Диапазон дат</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs mb-1">От:</p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateRange.from && "text-muted-foreground"
                              )}
                            >
                              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-3 w-3" />
                              {dateRange.from ? format(dateRange.from, 'dd.MM.yyyy') : "Не выбрано"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateRange.from}
                              onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <p className="text-xs mb-1">До:</p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateRange.to && "text-muted-foreground"
                              )}
                            >
                              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-3 w-3" />
                              {dateRange.to ? format(dateRange.to, 'dd.MM.yyyy') : "Не выбрано"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateRange.to}
                              onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Прогресс отчета</Label>
                      <span className="text-xs text-muted-foreground">
                        {progressRange[0]}% - {progressRange[1]}%
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={progressRange}
                      onValueChange={(values) => setProgressRange(values)}
                      className="py-4"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetFilters}
                      className="mr-2"
                    >
                      Сбросить
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => setShowFilterPopover(false)}
                    >
                      Применить
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="pt-4">
            {filteredReports.length === 0 ? (
              <div className="text-center text-gray-500 my-4">
                {reports.length === 0 ? "История отчетов пуста" : "Нет отчетов, соответствующих фильтрам"}
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
                      
                      {selectedReport === report.id && (
                        <div className="mt-3 pt-3 border-t">
                          <h5 className="font-medium text-sm mb-2">Содержание отчета:</h5>
                          
                          {report.sections.map((section) => (
                            <div key={section.id} className="mb-2">
                              <div className="text-sm font-medium">{section.title}</div>
                              <div className="text-xs text-gray-500">{section.location}</div>
                              
                              <ul className="mt-1 pl-4 text-xs space-y-1">
                                {section.items.map((item) => (
                                  <li 
                                    key={item.id}
                                    className="flex items-start gap-2"
                                  >
                                    <Checkbox 
                                      checked={item.checked} 
                                      disabled
                                      className="mt-0.5"
                                    />
                                    <div>
                                      <span className={cn(
                                        item.checked ? "text-green-600" : "text-gray-600"
                                      )}>
                                        {item.label}
                                      </span>
                                      {item.comment && (
                                        <div className="text-xs text-blue-500 pl-2">
                                          Комментарий: {item.comment}
                                        </div>
                                      )}
                                      {item.imageUrl && (
                                        <div className="mt-1">
                                          <img 
                                            src={item.imageUrl} 
                                            alt="Фото" 
                                            className="max-h-20 rounded border border-gray-200"
                                          />
                                        </div>
                                      )}
                                    </div>
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
                          onClick={() => toggleReportDetails(report.id)}
                          className="h-auto p-0 text-xs"
                        >
                          {selectedReport === report.id ? 'Скрыть детали' : 'Показать детали'}
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
