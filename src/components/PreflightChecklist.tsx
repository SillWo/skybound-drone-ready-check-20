
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faChevronUp, 
  faQuestionCircle,
  faSave,
  faCamera,
  faImage,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { v4 as uuidv4 } from 'uuid';
import { Report, ReportItem } from '@/types/report';
import { toast } from './ui/use-toast';
import { createDefaultTemplate } from '@/utils/default-report-template';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface PreflightChecklistProps {
  onProgressUpdate: (progress: number) => void;
}

export function PreflightChecklist({ onProgressUpdate }: PreflightChecklistProps) {
  // Use the default template for the checklist sections
  const [template, setTemplate] = useState(createDefaultTemplate());
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Initialize expanded sections from template
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    template.sections.forEach(section => {
      initialExpanded[section.id] = true;
    });
    setExpandedSections(initialExpanded);
  }, [template]);
  
  // Updated to store more complex state for each item
  const [itemStates, setItemStates] = useState<Record<string, {
    checked: boolean;
    comment?: string;
    imageUrl?: string;
  }>>({});
  
  // Initialize item states from template
  useEffect(() => {
    const initialStates: Record<string, {
      checked: boolean;
      comment?: string;
      imageUrl?: string;
    }> = {};
    
    template.sections.forEach(section => {
      section.items.forEach(item => {
        initialStates[item.id] = { 
          checked: item.checked || false,
          comment: item.comment,
          imageUrl: item.imageUrl
        };
      });
    });
    
    setItemStates(initialStates);
  }, [template]);
  
  // Dialog for image and comments
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemComment, setItemComment] = useState('');
  const [itemImage, setItemImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };
  
  const toggleItem = (id: string) => {
    setItemStates(prev => {
      const currentState = prev[id] || { checked: false };
      const newStates = {
        ...prev, 
        [id]: { 
          ...currentState,
          checked: !currentState.checked 
        }
      };
      
      updateTotalProgress(newStates);
      return newStates;
    });
  };
  
  // Open dialog for item details
  const openItemDetails = (id: string) => {
    const currentState = itemStates[id] || { checked: false };
    setSelectedItemId(id);
    setItemComment(currentState.comment || '');
    setItemImage(currentState.imageUrl || null);
    setShowItemDialog(true);
  };
  
  // Save item details
  const saveItemDetails = () => {
    if (!selectedItemId) return;
    
    setItemStates(prev => {
      const currentState = prev[selectedItemId] || { checked: false };
      return {
        ...prev,
        [selectedItemId]: {
          ...currentState,
          comment: itemComment || undefined,
          imageUrl: itemImage || undefined
        }
      };
    });
    
    setShowItemDialog(false);
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setItemImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Remove image
  const removeImage = () => {
    setItemImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Update total progress
  const updateTotalProgress = (states: Record<string, {checked: boolean, comment?: string, imageUrl?: string}>) => {
    const totalItems = template.sections.reduce((total, section) => total + section.items.length, 0);
    const checkedItems = Object.values(states).filter(state => state.checked).length;
    const progress = Math.round((checkedItems / totalItems) * 100);
    onProgressUpdate(progress);
  };

  // Calculate progress for each section
  const calculateProgress = (sectionItems: ReportItem[]) => {
    const itemIds = sectionItems.map(item => item.id);
    const checkedItems = itemIds.filter(id => itemStates[id]?.checked).length;
    return Math.round((checkedItems / itemIds.length) * 100);
  };
  
  // Calculate and update total progress when component mounts or itemStates changes
  useEffect(() => {
    updateTotalProgress(itemStates);
  }, [itemStates]);

  // Save current checklist state as a report
  const saveAsReport = () => {
    try {
      // Update the checked states based on current state
      const updatedSections = template.sections.map(section => {
        // Update items with the current state
        const updatedItems = section.items.map(item => {
          const state = itemStates[item.id] || { checked: false };
          return { 
            ...item, 
            checked: state.checked,
            comment: state.comment,
            imageUrl: state.imageUrl
          };
        });
        
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
        description: "Отчет был сохранен в истории отчетов",
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
      
      {template.sections.map((section) => (
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
              {section.items.map((item) => {
                const itemState = itemStates[item.id] || { checked: false };
                return (
                  <div 
                    key={item.id}
                    className="border-t py-3 px-4"
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          id={item.id} 
                          checked={itemState.checked} 
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
                      
                      <div className="flex items-center gap-2">
                        {/* Показываем кнопку фотоаппарата только для пункта "Сделать контрольное фото" */}
                        {item.label.includes('Сделать контрольное фото') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              openItemDetails(item.id);
                            }}
                          >
                            <FontAwesomeIcon 
                              icon={itemState.imageUrl ? faImage : faCamera} 
                              className={`h-4 w-4 ${itemState.imageUrl ? 'text-green-500' : 'text-gray-400'}`} 
                            />
                          </Button>
                        )}
                        
                        {item.hasHelp && (
                          <FontAwesomeIcon icon={faQuestionCircle} className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {/* Show comment if exists */}
                    {itemState.comment && (
                      <div className="mt-2 ml-7 text-xs text-gray-600 italic">
                        Комментарий: {itemState.comment}
                      </div>
                    )}
                    
                    {/* Show thumbnail if image exists */}
                    {itemState.imageUrl && (
                      <div className="mt-2 ml-7">
                        <img 
                          src={itemState.imageUrl} 
                          alt="Фото" 
                          className="max-h-32 rounded border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
      
      {/* Dialog for adding comment and image */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить комментарий и фото</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="comment">Комментарий</Label>
              <Input
                id="comment"
                value={itemComment}
                onChange={(e) => setItemComment(e.target.value)}
                placeholder="Введите комментарий..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Фото</Label>
              
              {itemImage ? (
                <div className="relative">
                  <img 
                    src={itemImage} 
                    alt="Загруженное фото" 
                    className="max-h-64 rounded border border-gray-200 mx-auto"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-md border-gray-300 p-4">
                  <label className="flex flex-col items-center cursor-pointer">
                    <FontAwesomeIcon icon={faCamera} className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Нажмите для загрузки фото</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              className="mr-2" 
              onClick={() => setShowItemDialog(false)}
            >
              Отмена
            </Button>
            <Button onClick={saveItemDetails}>Сохранить</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
