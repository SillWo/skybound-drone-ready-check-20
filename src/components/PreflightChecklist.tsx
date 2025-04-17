
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faChevronUp, 
  faQuestionCircle,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { v4 as uuidv4 } from 'uuid';
import { Report, ReportItem } from '@/types/report';
import { toast } from './ui/use-toast';
import { createDefaultTemplate } from '@/utils/default-report-template';

interface ChecklistSection {
  id: string;
  title: string;
  location: string;
  items: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  label: string;
  hasHelp: boolean;
}

interface PreflightChecklistProps {
  onProgressUpdate: (progress: number) => void;
}

export function PreflightChecklist({ onProgressUpdate }: PreflightChecklistProps) {
  const checklistSections: ChecklistSection[] = [
    {
      id: "section1",
      title: "Предварительная подготовка",
      location: "На базе",
      items: [
        { id: "item1", label: "Зарядить батареи", hasHelp: false },
        { id: "item2", label: "Подготовить и загрузить подложки для местности полетов на НСУ", hasHelp: true },
        { id: "item3", label: "Загрузить карту высот на НСУ", hasHelp: true },
        { id: "item4", label: "Подготовить маршрут", hasHelp: true },
        { id: "item5", label: "Произвести сбор оборудования по списку", hasHelp: false }
      ]
    },
    {
      id: "section2",
      title: "Предварительная подготовка",
      location: "На месте",
      items: [
        { id: "item6", label: "Оценить погодные условия", hasHelp: false },
        { id: "item7", label: "Произвести сборку БЛА", hasHelp: true },
        { id: "item8", label: "Развернуть НСУ", hasHelp: true }
      ]
    },
    {
      id: "section3",
      title: "Предварительная подготовка",
      location: "Перед взлетом",
      items: [
        { id: "item9", label: "Подать электропитание питание на БЛА", hasHelp: true },
        { id: "item10", label: "Проверить наличие связи с НСУ", hasHelp: true },
        { id: "item11", label: "Пройти предполетные проверки", hasHelp: false },
        { id: "item12", label: "Сделать контрольное фото (rphoto -e, rphoto -c 0)", hasHelp: true }
      ]
    }
  ];
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    section1: true,
    section2: true,
    section3: true
  });
  
  const [itemStates, setItemStates] = useState<Record<string, boolean>>(
    checklistSections.flatMap(section => section.items).reduce((acc, item) => ({...acc, [item.id]: false}), {})
  );
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };
  
  const toggleItem = (id: string) => {
    setItemStates(prev => {
      const newStates = {...prev, [id]: !prev[id]};
      
      // Calculate and update total progress
      const totalItems = checklistSections.reduce((total, section) => total + section.items.length, 0);
      const checkedItems = Object.values(newStates).filter(Boolean).length;
      const progress = Math.round((checkedItems / totalItems) * 100);
      
      // Call progress update callback
      onProgressUpdate(progress);
      
      return newStates;
    });
  };

  // Calculate progress for each section
  const calculateProgress = (sectionItems: ChecklistItem[]) => {
    const itemIds = sectionItems.map(item => item.id);
    const checkedItems = itemIds.filter(id => itemStates[id]).length;
    return Math.round((checkedItems / itemIds.length) * 100);
  };
  
  // Calculate and update total progress when component mounts or itemStates changes
  useEffect(() => {
    const totalItems = checklistSections.reduce((total, section) => total + section.items.length, 0);
    const checkedItems = Object.values(itemStates).filter(Boolean).length;
    const progress = Math.round((checkedItems / totalItems) * 100);
    onProgressUpdate(progress);
  }, [itemStates, checklistSections, onProgressUpdate]);

  // Save current checklist state as a report
  const saveAsReport = () => {
    try {
      // Get the default template
      const template = createDefaultTemplate();
      
      // Update the checked states based on current state
      const updatedSections = template.sections.map(section => {
        // We need to calculate total checked items for this section
        const updatedItems = section.items.map(item => ({ ...item, checked: false }));
        return { ...section, items: updatedItems };
      });
      
      const reportToSave: Report = {
        ...template,
        sections: updatedSections,
        date: new Date().toISOString(),
        totalProgress: 0, // Will be calculated by the ReportManager
      };
      
      // Save to localStorage
      const savedReports = localStorage.getItem('droneReports');
      let reports = savedReports ? JSON.parse(savedReports) : [];
      
      reports.push({
        ...reportToSave,
        droneData: {
          batteryLevel: 75, // Example values
          signalStrength: 75,
          gpsStatus: 'strong',
        },
        weatherData: {
          temperature: 22,
          windSpeed: 5,
          visibility: "Хорошая",
          isGoodWeather: true
        }
      });
      
      localStorage.setItem('droneReports', JSON.stringify(reports));
      
      toast({
        title: "Отчет сохранен",
        description: "Стандартный шаблон был сохранен в истории отчетов",
      });
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить отчет",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={saveAsReport}
          className="font-mono flex items-center gap-1"
        >
          <FontAwesomeIcon icon={faSave} className="h-3 w-3" />
          Сохранить как отчет
        </Button>
      </div>
      
      {checklistSections.map((section) => (
        <div key={section.id} className="bg-white shadow-sm rounded-md mb-4">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection(section.id)}
          >
            <div>
              <h3 className="font-mono font-medium text-lg">{section.title}</h3>
              <p className="font-mono text-sm text-gray-500">{section.location}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-32 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all" 
                    style={{ width: `${calculateProgress(section.items)}%` }}
                  />
                </div>
                <span className="text-sm font-mono font-medium">{calculateProgress(section.items)}%</span>
              </div>
              
              {expandedSections[section.id] ? (
                <FontAwesomeIcon icon={faChevronUp} className="h-5 w-5 text-gray-500" />
              ) : (
                <FontAwesomeIcon icon={faChevronDown} className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>
          
          {expandedSections[section.id] && (
            <div>
              {section.items.map((item) => (
                <div 
                  key={item.id}
                  className="border-t py-3 px-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id={item.id} 
                      checked={itemStates[item.id]} 
                      onCheckedChange={() => toggleItem(item.id)}
                      className="border-gray-400"
                    />
                    <label 
                      htmlFor={item.id}
                      className="text-sm cursor-pointer font-mono"
                    >
                      {item.label}
                    </label>
                  </div>
                  
                  {item.hasHelp && (
                    <FontAwesomeIcon icon={faQuestionCircle} className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
