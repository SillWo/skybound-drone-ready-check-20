
import { useState } from 'react';
import { ChecklistItem, ChecklistItemProps } from './ChecklistItem';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ChecklistSectionProps {
  title: string;
  description: string;
  items: Omit<ChecklistItemProps, 'onStatusChange'>[];
  onSectionStatusChange: (sectionTitle: string, passedCount: number, totalCount: number) => void;
}

export function ChecklistSection({ 
  title, 
  description, 
  items,
  onSectionStatusChange
}: ChecklistSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [itemStatuses, setItemStatuses] = useState<Record<string, 'pending' | 'passed' | 'failed'>>(
    items.reduce((acc, item) => ({...acc, [item.id]: 'pending'}), {})
  );
  
  const handleStatusChange = (id: string, status: 'pending' | 'passed' | 'failed') => {
    setItemStatuses(prev => ({...prev, [id]: status}));
    
    const passedCount = Object.values({...itemStatuses, [id]: status}).filter(s => s === 'passed').length;
    onSectionStatusChange(title, passedCount, items.length);
  };
  
  const passedCount = Object.values(itemStatuses).filter(status => status === 'passed').length;
  const progress = Math.round((passedCount / items.length) * 100);

  return (
    <div className="mb-8 bg-card p-4 rounded-lg shadow-sm">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4">
          {items.map((item) => (
            <ChecklistItem
              key={item.id}
              {...item}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
