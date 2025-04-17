
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { Button } from './ui/button';

export const DroneHeader = () => {
  return (
    <header className="w-full bg-[#f0f0f0] p-4 rounded-lg mb-6 flex justify-between items-center font-mono">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/af714633-6a79-4a7d-bccc-b7742680af3b.png" 
          alt="Logo" 
          className="h-8 w-8 object-contain"
        />
        <span className="font-medium text-gray-800">ABAKC</span>
      </div>
      
      <Button 
        variant="default" 
        size="sm"
        className="bg-orange-500 hover:bg-orange-600 text-white"
      >
        <FontAwesomeIcon icon={faTriangleExclamation} className="h-4 w-4 mr-2" />
        Сообщить об ошибке
      </Button>
    </header>
  );
};

