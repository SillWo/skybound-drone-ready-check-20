
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
import { toast } from './ui/use-toast';
import { createDefaultTemplate } from '@/utils/default-report-template';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  // Get the checklist sections from the default template
  const template = createDefaultTemplate();
  const checklistSections: ChecklistSection[] = template.sections.map(section => ({
    id: section.id,
    title: section.title,
    location: section.location,
    items: section.items.map(item => ({
      id: item.id,
      label: item.label,
      hasHelp: item.hasHelp
    }))
  }));
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    checklistSections.reduce((acc, section) => ({...acc, [section.id]: true}), {})
  );
  
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
        // Update items with current checked states
        const updatedItems = section.items.map(item => ({ 
          ...item, 
          checked: itemStates[item.id] || false 
        }));
        return { ...section, items: updatedItems };
      });
      
      // Calculate total progress
      const totalItems = checklistSections.reduce((total, section) => total + section.items.length, 0);
      const checkedItems = Object.values(itemStates).filter(Boolean).length;
      const progress = Math.round((checkedItems / totalItems) * 100);
      
      const reportToSave = {
        ...template,
        sections: updatedSections,
        date: new Date().toISOString(),
        totalProgress: progress,
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
        <Collapsible
          key={section.id}
          className="bg-white shadow-sm rounded-md mb-4"
          open={expandedSections[section.id]}
          onOpenChange={(isOpen) => setExpandedSections(prev => ({ ...prev, [section.id]: isOpen }))}
        >
          <div className="p-4 flex items-center justify-between">
            <CollapsibleTrigger className="flex-1 flex justify-between items-center">
              <div>
                <h3 className="font-mono font-medium text-lg text-left">{section.title}</h3>
                <p className="font-mono text-sm text-gray-500 text-left">{section.location}</p>
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
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
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
          </CollapsibleContent>
        </Collapsible>
      ))}
    </>
  );
}
