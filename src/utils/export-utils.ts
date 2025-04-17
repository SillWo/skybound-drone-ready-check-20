
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { SavedReport } from '@/types/report';

// Export report to PDF
export const exportToPdf = (report: SavedReport) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Helper for adding text
  const addText = (text: string, fontSize: number, x: number, y: number, options: any = {}) => {
    doc.setFontSize(fontSize);
    doc.text(text, x, y, options);
    return doc.getTextDimensions(text).h + 2;
  };
  
  // Title
  let yPos = 20;
  doc.setFont('helvetica', 'bold');
  yPos += addText(report.title, 16, pageWidth / 2, yPos, { align: 'center' });
  
  // Date
  doc.setFont('helvetica', 'normal');
  const date = new Date(report.date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  yPos += 5;
  yPos += addText(`Дата: ${date}`, 10, pageWidth / 2, yPos, { align: 'center' });
  
  // Progress
  yPos += 5;
  yPos += addText(`Общий прогресс: ${report.totalProgress}%`, 10, pageWidth / 2, yPos, { align: 'center' });
  
  // Drone data
  yPos += 10;
  yPos += addText('Состояние дрона:', 12, 20, yPos);
  yPos += 5;
  yPos += addText(`Батарея: ${report.droneData.batteryLevel}%`, 10, 25, yPos);
  yPos += 5;
  yPos += addText(`Сигнал: ${report.droneData.signalStrength}%`, 10, 25, yPos);
  
  let gpsStatusText = '';
  switch (report.droneData.gpsStatus) {
    case 'strong':
      gpsStatusText = 'Сильный сигнал';
      break;
    case 'weak':
      gpsStatusText = 'Слабый сигнал';
      break;
    default:
      gpsStatusText = 'Нет сигнала';
      break;
  }
  yPos += 5;
  yPos += addText(`GPS: ${gpsStatusText}`, 10, 25, yPos);
  
  // Weather data
  yPos += 10;
  yPos += addText('Погодные условия:', 12, 20, yPos);
  yPos += 5;
  yPos += addText(`Температура: ${report.weatherData.temperature}°C`, 10, 25, yPos);
  yPos += 5;
  yPos += addText(`Ветер: ${report.weatherData.windSpeed} км/ч`, 10, 25, yPos);
  yPos += 5;
  yPos += addText(`Видимость: ${report.weatherData.visibility}`, 10, 25, yPos);
  yPos += 5;
  yPos += addText(
    `Статус: ${report.weatherData.isGoodWeather ? 'Подходит для полета' : 'Не подходит для полета'}`, 
    10, 25, yPos
  );
  
  // Sections
  report.sections.forEach((section, sectionIndex) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    yPos += 15;
    doc.setFont('helvetica', 'bold');
    yPos += addText(`${sectionIndex + 1}. ${section.title} (${section.location})`, 12, 20, yPos);
    doc.setFont('helvetica', 'normal');
    
    // Section progress
    const sectionProgress = section.items.length > 0 
      ? Math.round((section.items.filter(item => item.checked).length / section.items.length) * 100) 
      : 0;
    yPos += 5;
    yPos += addText(`Прогресс раздела: ${sectionProgress}%`, 10, 25, yPos);
    
    // Items
    section.items.forEach((item, itemIndex) => {
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      yPos += 7;
      const statusText = item.checked ? '✓' : '✗';
      const itemText = `${statusText} ${item.label}`;
      yPos += addText(`${sectionIndex + 1}.${itemIndex + 1}. ${itemText}`, 10, 25, yPos);
      
      // Comment
      if (item.comment) {
        yPos += 5;
        doc.setTextColor(0, 0, 255);
        yPos += addText(`Комментарий: ${item.comment}`, 9, 35, yPos);
        doc.setTextColor(0, 0, 0);
      }
    });
  });
  
  // Save PDF
  doc.save(`${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// Export report to JSON
export const exportToJson = (report: SavedReport) => {
  const jsonContent = JSON.stringify(report, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  saveAs(blob, `${report.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`);
};
