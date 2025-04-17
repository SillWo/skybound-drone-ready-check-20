
import { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChecklistItemProps {
  id: string;
  title: string;
  description: string;
  category: string;
  required: boolean;
  onStatusChange: (id: string, status: 'pending' | 'passed' | 'failed') => void;
}

export function ChecklistItem({ 
  id, 
  title, 
  description, 
  category, 
  required,
  onStatusChange 
}: ChecklistItemProps) {
  const [status, setStatus] = useState<'pending' | 'passed' | 'failed'>('pending');

  const handleStatusChange = (newStatus: 'pending' | 'passed' | 'failed') => {
    setStatus(newStatus);
    onStatusChange(id, newStatus);
  };

  return (
    <div className={cn(
      "border rounded-lg p-4 mb-3 transition-all",
      status === 'pending' && "bg-card border-muted",
      status === 'passed' && "bg-success/10 border-success/30",
      status === 'failed' && "bg-destructive/10 border-destructive/30"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
            {required && (
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                Required
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          <div className="text-xs text-muted-foreground mt-2">Category: {category}</div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusChange('passed')}
            className={cn(
              "p-2 rounded-md transition-colors",
              status === 'passed' 
                ? "bg-success text-success-foreground" 
                : "bg-muted hover:bg-success/20"
            )}
          >
            <Check className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => handleStatusChange('failed')}
            className={cn(
              "p-2 rounded-md transition-colors",
              status === 'failed' 
                ? "bg-destructive text-destructive-foreground" 
                : "bg-muted hover:bg-destructive/20"
            )}
          >
            <X className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => handleStatusChange('pending')}
            className={cn(
              "p-2 rounded-md transition-colors",
              status === 'pending' 
                ? "bg-muted-foreground/20" 
                : "bg-muted hover:bg-muted-foreground/10"
            )}
          >
            <AlertCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
