
import { Report, SavedReport, ReportItem } from '@/types/report';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import html2canvas from 'html2canvas';

// Format date for display
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: ru });
  } catch {
    return dateString;
  }
};

// Convert report to HTML
const reportToHTML = (report: SavedReport): string => {
  const reportDate = formatDate(report.date);
  
  let reportHTML = `
    <html>
    <head>
      <title>Отчет: ${report.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.5;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .report-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 1px solid #eee;
          padding-bottom: 20px;
        }
        .report-title {
          font-size: 24px;
          font-weight: bold;
          margin: 10px 0;
        }
        .report-meta {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          color: #666;
        }
        .drone-data, .weather-data {
          background: #f9f9f9;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }
        .data-title {
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .data-row {
          display: flex;
          margin: 5px 0;
        }
        .data-label {
          font-weight: 500;
          width: 160px;
        }
        .section {
          margin: 30px 0;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 15px;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .section-title {
          font-weight: bold;
          font-size: 18px;
        }
        .section-location {
          color: #666;
          font-style: italic;
        }
        .section-progress {
          font-weight: bold;
          color: #4CAF50;
        }
        .items-list {
          list-style-type: none;
          padding: 0;
        }
        .checklist-item {
          padding: 10px;
          border-bottom: 1px solid #f5f5f5;
          display: flex;
        }
        .item-checked {
          background-color: #f9fff9;
        }
        .item-status {
          font-weight: bold;
          width: 30px;
        }
        .item-checked .item-status {
          color: #4CAF50;
        }
        .item-unchecked .item-status {
          color: #f44336;
        }
        .item-content {
          flex: 1;
        }
        .item-comment {
          margin-top: 5px;
          color: #666;
          font-style: italic;
        }
        .item-image {
          max-width: 200px;
          margin-top: 10px;
          border: 1px solid #eee;
        }
        .page-footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .progress-bar {
          height: 10px;
          background: #eee;
          border-radius: 5px;
          margin: 5px 0;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #4CAF50;
        }
      </style>
    </head>
    <body>
      <div class="report-header">
        <div class="report-title">${report.title}</div>
        <div>Дата создания: ${reportDate}</div>
      </div>
      
      <div class="report-meta">
        <div>Общий прогресс: ${report.totalProgress}%</div>
        <div>ID отчета: ${report.id.substring(0, 8)}</div>
      </div>
      
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${report.totalProgress}%"></div>
      </div>
      
      <div class="drone-data">
        <div class="data-title">Данные дрона</div>
        <div class="data-row">
          <div class="data-label">Уровень батареи:</div>
          <div>${report.droneData.batteryLevel}%</div>
        </div>
        <div class="data-row">
          <div class="data-label">Сила сигнала:</div>
          <div>${report.droneData.signalStrength}%</div>
        </div>
        <div class="data-row">
          <div class="data-label">Статус GPS:</div>
          <div>${mapGpsStatus(report.droneData.gpsStatus)}</div>
        </div>
      </div>
      
      <div class="weather-data">
        <div class="data-title">Погодные условия</div>
        <div class="data-row">
          <div class="data-label">Температура:</div>
          <div>${report.weatherData.temperature}°C</div>
        </div>
        <div class="data-row">
          <div class="data-label">Скорость ветра:</div>
          <div>${report.weatherData.windSpeed} м/с</div>
        </div>
        <div class="data-row">
          <div class="data-label">Видимость:</div>
          <div>${report.weatherData.visibility}</div>
        </div>
        <div class="data-row">
          <div class="data-label">Подходит для полета:</div>
          <div>${report.weatherData.isGoodWeather ? 'Да' : 'Нет'}</div>
        </div>
      </div>
  `;
  
  // Add sections
  report.sections.forEach((section, sectionIndex) => {
    // Calculate section progress
    const totalItems = section.items.length;
    const checkedItems = section.items.filter(item => item.checked).length;
    const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
    
    reportHTML += `
      <div class="section">
        <div class="section-header">
          <div>
            <div class="section-title">${sectionIndex + 1}. ${section.title}</div>
            <div class="section-location">${section.location}</div>
          </div>
          <div class="section-progress">${progress}%</div>
        </div>
        
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
    `;
    
    if (section.items.length === 0) {
      reportHTML += `<p>Нет пунктов в разделе</p>`;
    } else {
      reportHTML += `<ul class="items-list">`;
      
      section.items.forEach(item => {
        const itemClass = item.checked ? 'item-checked' : 'item-unchecked';
        const statusIcon = item.checked ? '✓' : '✗';
        
        reportHTML += `
          <li class="checklist-item ${itemClass}">
            <div class="item-status">${statusIcon}</div>
            <div class="item-content">
              <div>${item.label}</div>
              ${item.comment ? `<div class="item-comment">Комментарий: ${item.comment}</div>` : ''}
              ${item.imageUrl ? `<img src="${item.imageUrl}" class="item-image" alt="Фото для пункта"/>` : ''}
            </div>
          </li>
        `;
      });
      
      reportHTML += `</ul>`;
    }
    
    reportHTML += `</div>`;
  });
  
  // Add footer
  reportHTML += `
      <div class="page-footer">
        Отчет сформирован: ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale: ru })}
      </div>
    </body>
    </html>
  `;
  
  return reportHTML;
};

// Export to PDF using HTML
export const exportToPdf = async (report: SavedReport) => {
  try {
    // Create HTML content for the report
    const reportHtml = reportToHTML(report);
    
    // Create a temporary container to render the HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = reportHtml;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);
    
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create PDF with html2canvas
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const sections = tempContainer.querySelectorAll('.section, .drone-data, .weather-data, .report-header');
    
    let currentY = 40;
    
    // Add first page header
    pdf.setFontSize(18);
    const title = report.title;
    pdf.text(title, pageWidth / 2, 30, { align: 'center' });
    
    // Process each section
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i] as HTMLElement;
      
      // Capture section as canvas
      const canvas = await html2canvas(section, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate image dimensions to fit page width
      const imgWidth = pageWidth - 40; // margins
      const ratio = canvas.width / imgWidth;
      const imgHeight = canvas.height / ratio;
      
      // Check if we need a new page
      if (currentY + imgHeight > pageHeight - 40) {
        pdf.addPage();
        currentY = 40;
        
        // Add page header
        pdf.setFontSize(12);
        pdf.text(title, pageWidth / 2, 20, { align: 'center' });
      }
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 20, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 20;
    }
    
    // Add page numbers
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.text(`Страница ${i} из ${totalPages}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
    }
    
    // Remove the temporary container
    document.body.removeChild(tempContainer);
    
    // Save PDF
    const fileName = `Отчет_${formatFileName(report.title)}_${format(new Date(), 'dd-MM-yyyy_HH-mm')}.pdf`;
    pdf.save(fileName);
    
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
