
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faFilePdf, faFileCode, faHistory } from '@fortawesome/free-solid-svg-icons';

export function WelcomeMessage() {
  return (
    <div className="bg-white shadow-sm rounded-md p-6 mb-4">
      <h2 className="text-xl font-mono font-medium mb-4 text-center">Конструктор отчетов</h2>
      
      <div className="space-y-4 text-gray-600">
        <p className="font-mono text-sm">
          Конструктор отчетов позволяет создавать и настраивать свои собственные чек-листы для предполетной подготовки.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="border p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faClipboardCheck} className="h-4 w-4 text-green-500" />
              <span className="font-mono font-medium">Создание отчетов</span>
            </div>
            <p className="font-mono text-xs">
              Создавайте новые разделы и пункты чек-листа, добавляйте комментарии
            </p>
          </div>
          
          <div className="border p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faHistory} className="h-4 w-4 text-blue-500" />
              <span className="font-mono font-medium">История отчетов</span>
            </div>
            <p className="font-mono text-xs">
              Все созданные отчеты сохраняются автоматически и доступны в истории
            </p>
          </div>
          
          <div className="border p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faFilePdf} className="h-4 w-4 text-red-500" />
              <span className="font-mono font-medium">Экспорт в PDF</span>
            </div>
            <p className="font-mono text-xs">
              Выгружайте отчеты в PDF формате для печати или дальнейшего использования
            </p>
          </div>
          
          <div className="border p-3 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faFileCode} className="h-4 w-4 text-blue-500" />
              <span className="font-mono font-medium">Экспорт в JSON</span>
            </div>
            <p className="font-mono text-xs">
              Выгружайте отчеты в JSON формате для интеграции с другими системами
            </p>
          </div>
        </div>
        
        <p className="font-mono text-sm mt-4 text-center">
          Для начала работы нажмите кнопку "Новый отчет"
        </p>
      </div>
    </div>
  );
}
