
import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

interface ChecklistItem {
  id: string;
  label: string;
  hasHelp: boolean;
}

export function PreflightChecklist() {
  const [expanded, setExpanded] = useState(true);
  
  const checklistItems: ChecklistItem[] = [
    { id: "item1", label: "Зарядить батареи", hasHelp: false },
    { id: "item2", label: "Подготовить и загрузить подложки для местности полетов на НСУ", hasHelp: true },
    { id: "item3", label: "Загрузить карту высот на НСУ", hasHelp: true },
    { id: "item4", label: "Загрузить карту высот на НСУ", hasHelp: true },
    { id: "item5", label: "Подготовить маршрут", hasHelp: true },
    { id: "item6", label: "Произвести сбор оборудования по списку", hasHelp: false }
  ];
  
  const [itemStates, setItemStates] = useState<Record<string, boolean>>(
    checklistItems.reduce((acc, item) => ({...acc, [item.id]: false}), {})
  );
  
  const toggleItem = (id: string) => {
    setItemStates(prev => ({...prev, [id]: !prev[id]}));
  };

  return (
    <div className="bg-white shadow-sm rounded-md mb-6">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium text-lg">Предварительная подготовка</h3>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>
      
      {expanded && (
        <div>
          {checklistItems.map((item) => (
            <div 
              key={item.id}
              className="border-t py-3 px-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Checkbox 
                  id={item.id} 
                  checked={itemStates[item.id]} 
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <label 
                  htmlFor={item.id}
                  className="text-sm cursor-pointer"
                >
                  {item.label}
                </label>
              </div>
              
              {item.hasHelp && (
                <HelpCircle className="h-5 w-5 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
