
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faSave, 
  faTrash, 
  faEdit,
  faChevronDown,
  faChevronUp,
  faQuestionCircle,
  faComment
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { ReportItem, ReportSection, Report } from '@/types/report';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

interface ReportConstructorProps {
  initialReport?: Report;
  onSaveReport: (report: Report) => void;
}

export function ReportConstructor({ initialReport, onSaveReport }: ReportConstructorProps) {
  const [reportTitle, setReportTitle] = useState(initialReport?.title || 'Новый отчет');
  const [sections, setSections] = useState<ReportSection[]>(
    initialReport?.sections || []
  );
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    initialReport?.sections?.reduce((acc, section) => ({...acc, [section.id]: true}), {}) || {}
  );

  // Dialog states
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionLocation, setNewSectionLocation] = useState('');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const [showAddItem, setShowAddItem] = useState(false);
  const [sectionForNewItem, setSectionForNewItem] = useState<string | null>(null);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemHasHelp, setNewItemHasHelp] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [itemForComment, setItemForComment] = useState<{sectionId: string, itemId: string} | null>(null);
  const [commentText, setCommentText] = useState('');

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  // Add new section
  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: ReportSection = {
      id: uuidv4(),
      title: newSectionTitle.trim(),
      location: newSectionLocation.trim(),
      items: []
    };

    setSections([...sections, newSection]);
    setExpandedSections(prev => ({...prev, [newSection.id]: true}));
    setNewSectionTitle('');
    setNewSectionLocation('');
    setShowAddSection(false);
  };

  // Edit section
  const handleEditSection = () => {
    if (!editingSectionId || !newSectionTitle.trim()) return;

    setSections(sections.map(section => 
      section.id === editingSectionId 
        ? { ...section, title: newSectionTitle.trim(), location: newSectionLocation.trim() } 
        : section
    ));
    
    setEditingSectionId(null);
    setNewSectionTitle('');
    setNewSectionLocation('');
    setShowAddSection(false);
  };

  // Delete section
  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  // Open edit section dialog
  const openEditSectionDialog = (section: ReportSection) => {
    setEditingSectionId(section.id);
    setNewSectionTitle(section.title);
    setNewSectionLocation(section.location);
    setShowAddSection(true);
  };

  // Add new item to section
  const handleAddItem = () => {
    if (!sectionForNewItem || !newItemLabel.trim()) return;

    const newItem: ReportItem = {
      id: uuidv4(),
      label: newItemLabel.trim(),
      hasHelp: newItemHasHelp,
      checked: false
    };

    setSections(sections.map(section => 
      section.id === sectionForNewItem 
        ? { ...section, items: [...section.items, newItem] } 
        : section
    ));
    
    setNewItemLabel('');
    setNewItemHasHelp(false);
    setShowAddItem(false);
    setSectionForNewItem(null);
  };

  // Edit item
  const handleEditItem = () => {
    if (!sectionForNewItem || !editingItemId || !newItemLabel.trim()) return;

    setSections(sections.map(section => 
      section.id === sectionForNewItem 
        ? { 
            ...section, 
            items: section.items.map(item => 
              item.id === editingItemId 
                ? { ...item, label: newItemLabel.trim(), hasHelp: newItemHasHelp } 
                : item
            ) 
          } 
        : section
    ));
    
    setEditingItemId(null);
    setNewItemLabel('');
    setNewItemHasHelp(false);
    setShowAddItem(false);
    setSectionForNewItem(null);
  };

  // Delete item
  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, items: section.items.filter(item => item.id !== itemId) } 
        : section
    ));
  };

  // Open edit item dialog
  const openEditItemDialog = (sectionId: string, item: ReportItem) => {
    setSectionForNewItem(sectionId);
    setEditingItemId(item.id);
    setNewItemLabel(item.label);
    setNewItemHasHelp(item.hasHelp);
    setShowAddItem(true);
  };

  // Handle item checkbox change
  const toggleItem = (sectionId: string, itemId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: section.items.map(item => 
              item.id === itemId 
                ? { ...item, checked: !item.checked } 
                : item
            ) 
          } 
        : section
    ));
  };

  // Open comment dialog
  const openCommentDialog = (sectionId: string, itemId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const item = section?.items.find(i => i.id === itemId);
    
    setItemForComment({sectionId, itemId});
    setCommentText(item?.comment || '');
    setShowCommentDialog(true);
  };

  // Save comment
  const handleSaveComment = () => {
    if (!itemForComment) return;

    setSections(sections.map(section => 
      section.id === itemForComment.sectionId 
        ? { 
            ...section, 
            items: section.items.map(item => 
              item.id === itemForComment.itemId 
                ? { ...item, comment: commentText.trim() } 
                : item
            ) 
          } 
        : section
    ));
    
    setShowCommentDialog(false);
    setItemForComment(null);
    setCommentText('');
  };

  // Calculate progress for each section
  const calculateProgress = (sectionItems: ReportItem[]) => {
    if (sectionItems.length === 0) return 0;
    const checkedItems = sectionItems.filter(item => item.checked).length;
    return Math.round((checkedItems / sectionItems.length) * 100);
  };

  // Calculate total progress
  const calculateTotalProgress = () => {
    const totalItems = sections.reduce((total, section) => total + section.items.length, 0);
    if (totalItems === 0) return 0;
    
    const checkedItems = sections.reduce(
      (total, section) => total + section.items.filter(item => item.checked).length, 
      0
    );
    
    return Math.round((checkedItems / totalItems) * 100);
  };

  // Save report
  const handleSaveReport = () => {
    const totalProgress = calculateTotalProgress();
    const report: Report = {
      id: initialReport?.id || uuidv4(),
      title: reportTitle,
      date: new Date().toISOString(),
      sections,
      totalProgress
    };
    
    onSaveReport(report);
  };

  return (
    <div className="bg-white shadow-sm rounded-md p-4 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Input
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="font-mono font-medium text-lg border-none bg-transparent p-0 h-auto max-w-[250px]"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAddSection(true)}
            className="flex items-center gap-1 font-mono"
          >
            <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
            Раздел
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            onClick={handleSaveReport}
            className="flex items-center gap-1 font-mono"
          >
            <FontAwesomeIcon icon={faSave} className="h-3 w-3" />
            Сохранить
          </Button>
        </div>
      </div>
      
      {sections.length === 0 ? (
        <div className="text-center text-gray-500 my-8 font-mono">
          Добавьте разделы для создания отчета
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="font-mono text-sm text-gray-500">Общий прогресс: {calculateTotalProgress()}%</div>
            <div className="w-48 h-1.5 bg-gray-300 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all" 
                style={{ width: `${calculateTotalProgress()}%` }}
              />
            </div>
          </div>
          
          {sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-md mb-4">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer border-b"
              >
                <div onClick={() => toggleSection(section.id)}>
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
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditSectionDialog(section)}
                      className="h-8 w-8"
                    >
                      <FontAwesomeIcon icon={faEdit} className="h-4 w-4 text-gray-500" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSection(section.id)}
                      className="h-8 w-8"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-4 w-4 text-gray-500" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSectionForNewItem(section.id);
                        setShowAddItem(true);
                      }}
                      className="h-8 w-8"
                    >
                      <FontAwesomeIcon icon={faPlus} className="h-4 w-4 text-gray-500" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSection(section.id)}
                      className="h-8 w-8"
                    >
                      {expandedSections[section.id] ? (
                        <FontAwesomeIcon icon={faChevronUp} className="h-4 w-4 text-gray-500" />
                      ) : (
                        <FontAwesomeIcon icon={faChevronDown} className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              {expandedSections[section.id] && (
                <div>
                  {section.items.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 font-mono text-sm">
                      Нет элементов в этом разделе
                    </div>
                  ) : (
                    section.items.map((item) => (
                      <div 
                        key={item.id}
                        className="border-t py-3 px-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            id={`item-${item.id}`} 
                            checked={item.checked} 
                            onCheckedChange={() => toggleItem(section.id, item.id)}
                            className="border-gray-400"
                          />
                          <label 
                            htmlFor={`item-${item.id}`}
                            className={cn(
                              "text-sm cursor-pointer font-mono",
                              item.checked && "line-through text-gray-500"
                            )}
                          >
                            {item.label}
                          </label>
                          
                          {item.comment && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                              Есть комментарий
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openCommentDialog(section.id, item.id)}
                            className="h-8 w-8"
                          >
                            <FontAwesomeIcon 
                              icon={faComment} 
                              className={cn(
                                "h-4 w-4",
                                item.comment ? "text-blue-500" : "text-gray-400"
                              )} 
                            />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditItemDialog(section.id, item)}
                            className="h-8 w-8"
                          >
                            <FontAwesomeIcon icon={faEdit} className="h-4 w-4 text-gray-400" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteItem(section.id, item.id)}
                            className="h-8 w-8"
                          >
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4 text-gray-400" />
                          </Button>
                          
                          {item.hasHelp && (
                            <FontAwesomeIcon icon={faQuestionCircle} className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Add/Edit Section Dialog */}
      <Dialog open={showAddSection} onOpenChange={setShowAddSection}>
        <DialogContent className="font-mono">
          <DialogHeader>
            <DialogTitle>{editingSectionId ? 'Редактировать раздел' : 'Добавить раздел'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Название</label>
              <Input
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Название раздела"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Расположение</label>
              <Input
                value={newSectionLocation}
                onChange={(e) => setNewSectionLocation(e.target.value)}
                placeholder="Например: На базе, На месте, и т.д."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowAddSection(false);
                setEditingSectionId(null);
                setNewSectionTitle('');
                setNewSectionLocation('');
              }}>
                Отмена
              </Button>
              
              <Button onClick={editingSectionId ? handleEditSection : handleAddSection}>
                {editingSectionId ? 'Сохранить' : 'Добавить'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Item Dialog */}
      <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
        <DialogContent className="font-mono">
          <DialogHeader>
            <DialogTitle>{editingItemId ? 'Редактировать пункт' : 'Добавить пункт'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Текст пункта</label>
              <Input
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
                placeholder="Текст пункта"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="has-help" 
                checked={newItemHasHelp} 
                onCheckedChange={(checked) => setNewItemHasHelp(!!checked)}
              />
              <label htmlFor="has-help" className="text-sm font-medium cursor-pointer">
                Добавить значок подсказки
              </label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowAddItem(false);
                setSectionForNewItem(null);
                setEditingItemId(null);
                setNewItemLabel('');
                setNewItemHasHelp(false);
              }}>
                Отмена
              </Button>
              
              <Button onClick={editingItemId ? handleEditItem : handleAddItem}>
                {editingItemId ? 'Сохранить' : 'Добавить'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="font-mono">
          <DialogHeader>
            <DialogTitle>Комментарий к пункту</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Комментарий</label>
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Введите комментарий"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowCommentDialog(false);
                setItemForComment(null);
                setCommentText('');
              }}>
                Отмена
              </Button>
              
              <Button onClick={handleSaveComment}>
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
