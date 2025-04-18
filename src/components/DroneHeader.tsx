
import React from 'react';
import { Link } from 'react-router-dom';
import { User, ClipboardCheck, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const DroneHeader = () => {
  return (
    <header className="w-full bg-[#f0f0f0] p-4 rounded-lg mb-6 flex justify-between items-center font-mono">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/582d9d93-d3d5-45c4-970c-08fb25417162.png" 
          alt="АБАКС Логотип" 
          className="h-12 w-auto object-contain mix-blend-multiply"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 hover:bg-gray-200 rounded-md transition-colors">
          <div className="w-6 h-5 flex flex-col justify-between">
            <div className="h-0.5 w-full bg-gray-600"></div>
            <div className="h-0.5 w-full bg-gray-600"></div>
            <div className="h-0.5 w-full bg-gray-600"></div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link to="/user" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Данные пользователя</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span>Стандартный чек-лист</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/report" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Конструктор отчётов</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
