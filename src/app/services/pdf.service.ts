import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generatePdf(data: any): void {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    let y = margin;

    // Helper function to add text and handle page overflow
    const addText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
      const splitText = doc.splitTextToSize(text, maxWidth);
      splitText.forEach((line: string) => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin; // Reset Y position for the new page
        }
        doc.text(line, x, y);
        y += lineHeight;
      });
      return y;
    };

    const lineHeight = 6; // Define the line height

    // Nombre
    doc.setFontSize(18);
    y = addText(`Nombre: ${data.json_data.nombre}`, margin, y, pageWidth - margin * 2, lineHeight);

    // Ubicación
    doc.setFontSize(12);
    y = addText(`${data.json_data.ubicacion}`, margin, y, pageWidth - margin * 2, lineHeight);
    // Email
    doc.setFontSize(12);
    y = addText(`Email: ${data.json_data.email}`, margin, y, pageWidth - margin * 2, lineHeight);
    // Teléfono
    y = addText(`Teléfono: ${data.json_data.telefono}`, margin, y, pageWidth - margin * 2, lineHeight);

    y += 5;

    // Perfil
    doc.setFontSize(14);
    y = addText(`Perfil:`, margin, y, pageWidth - margin * 2, lineHeight);
    doc.setFontSize(12);
    y = addText(`${data.json_data.perfil}`, margin + 5, y, pageWidth - margin * 2, lineHeight);

    // Espaciado adicional antes de la siguiente sección
    y += 5;

    // Educación
    doc.setFontSize(14);
    y = addText('Educación:', margin, y, pageWidth - margin * 2, lineHeight);
    data.json_data.educacion.forEach((edu: any) => {
      doc.setFontSize(12);
      y = addText(`${edu.años} - ${edu.titulo} (${edu.universidad})`, margin + 5, y, pageWidth - margin * 2, lineHeight);
    });

    y += 5;

    // Experiencia
    doc.setFontSize(14);
    y = addText('Experiencia:', margin, y, pageWidth - margin * 2, lineHeight);
    data.json_data.experiencia.forEach((exp: any) => {
      doc.setFontSize(12);
      y = addText(`-${exp.años} - ${exp.cargo} en ${exp.empresa}`, margin + 5, y, pageWidth - margin * 2, lineHeight);
      y = addText(`${exp.descripcion}`, margin + 10, y, pageWidth - margin * 2, lineHeight);
    });

    y += 5;

    // Conocimientos
    doc.setFontSize(14);
    y = addText('Conocimientos:', margin, y, pageWidth - margin * 2, lineHeight);
    data.json_data.conocimientos.forEach((conocimiento: string) => {
      doc.setFontSize(12);
      y = addText(`- ${conocimiento}`, margin + 5, y, pageWidth - margin * 2, lineHeight);
    });

    // Guardar el PDF
    doc.save(`cv_${data.json_data.nombre}.pdf`);
  }
}
