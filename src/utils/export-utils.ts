
import { Report, SavedReport } from '@/types/report';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';

// Format date for display
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: ru });
  } catch {
    return dateString;
  }
};

// Export to PDF
export const exportToPdf = (report: SavedReport) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add logo
    doc.setFontSize(18);
    doc.text('АБАКС', pageWidth / 2, 15, { align: 'center' });
    
    // Add report title
    doc.setFontSize(16);
    doc.text(report.title, pageWidth / 2, 25, { align: 'center' });
    
    // Add date and progress info
    doc.setFontSize(10);
    doc.text(`Дата отчета: ${formatDate(report.date)}`, 14, 35);
    doc.text(`Общий прогресс: ${report.totalProgress}%`, 14, 40);
    
    // Add drone data
    doc.setFontSize(12);
    doc.text('Данные дрона:', 14, 50);
    doc.setFontSize(10);
    doc.text(`Уровень батареи: ${report.droneData.batteryLevel}%`, 20, 55);
    doc.text(`Сила сигнала: ${report.droneData.signalStrength}%`, 20, 60);
    doc.text(`Статус GPS: ${mapGpsStatus(report.droneData.gpsStatus)}`, 20, 65);
    
    // Add weather data
    doc.setFontSize(12);
    doc.text('Погодные условия:', 14, 75);
    doc.setFontSize(10);
    doc.text(`Температура: ${report.weatherData.temperature}°C`, 20, 80);
    doc.text(`Скорость ветра: ${report.weatherData.windSpeed} м/с`, 20, 85);
    doc.text(`Видимость: ${report.weatherData.visibility}`, 20, 90);
    doc.text(`Подходит для полета: ${report.weatherData.isGoodWeather ? 'Да' : 'Нет'}`, 20, 95);
    
    let yPosition = 105;
    const lineHeight = 5;
    
    // For each section
    report.sections.forEach((section, sectionIndex) => {
      if (yPosition > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Section header
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${sectionIndex + 1}. ${section.title}`, 14, yPosition);
      yPosition += lineHeight;
      
      doc.setFontSize(10);
      doc.text(`Расположение: ${section.location}`, 18, yPosition);
      yPosition += lineHeight * 1.5;
      
      // Calculate progress for the section
      const totalItems = section.items.length;
      const checkedItems = section.items.filter(item => item.checked).length;
      const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
      
      doc.text(`Прогресс раздела: ${progress}%`, 18, yPosition);
      yPosition += lineHeight * 1.5;
      
      // Create table for checklist items
      const tableData = section.items.map(item => [
        item.checked ? '✓' : '✗',
        item.label,
        item.comment || ''
      ]);
      
      if (tableData.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [['Статус', 'Пункт', 'Комментарий']],
          body: tableData,
          theme: 'grid',
          headStyles: {
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 50 }
          }
        });
        
        // Update position after table
        yPosition = (doc as any).lastAutoTable.finalY + 15;
      } else {
        doc.text('Нет пунктов в разделе', 18, yPosition);
        yPosition += lineHeight * 2;
      }
    });
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Страница ${i} из ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      doc.text(`Сформировано: ${format(new Date(), 'dd.MM.yyyy HH:mm')}`, 14, doc.internal.pageSize.getHeight() - 10);
    }
    
    // Save PDF
    doc.save(`Отчет_${formatFileName(report.title)}_${format(new Date(), 'dd-MM-yyyy_HH-mm')}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Ошибка при создании PDF. Подробности в консоли.');
  }
};

// Export to JSON
export const exportToJson = (report: SavedReport) => {
  try {
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportName = `Отчет_${formatFileName(report.title)}_${format(new Date(), 'dd-MM-yyyy_HH-mm')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
    
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    alert('Ошибка при экспорте в JSON. Подробности в консоли.');
  }
};

// Helper functions
const formatFileName = (name: string) => {
  return name
    .replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 30);
};

const mapGpsStatus = (status: 'strong' | 'weak' | 'no-signal') => {
  switch (status) {
    case 'strong': return 'Сильный сигнал';
    case 'weak': return 'Слабый сигнал';
    case 'no-signal': return 'Нет сигнала';
    default: return status;
  }
};
