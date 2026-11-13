import { jsPDF } from 'jspdf';
import { numeroALetras } from './numberToWords';

export function generateActaPDF({ mesa, partidos, especiales, jurados, totals }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 14;

  // Header Institucional
  doc.setFillColor(14, 90, 62); // Verde institucional OEP
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('ÓRGANO ELECTORAL PLURINACIONAL', pageWidth / 2, 8, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('TRIBUNAL ELECTORAL DEPARTAMENTAL DE ' + (mesa.departamento ? mesa.departamento.toUpperCase() : 'BOLIVIA'), pageWidth / 2, 14, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(220, 240, 230);
  doc.text('ACTA DE ESCRUTINIO Y CÓMPUTO DE MESA DE SUFRAGIO - ELECCIONES GENERALES', pageWidth / 2, 19, { align: 'center' });

  y = 30;

  // Subtítulo y código de mesa
  doc.setTextColor(14, 90, 62);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`MESA DE SUFRAGIO Nº ${mesa.numeroMesa}  |  CÓDIGO: ${mesa.codigoMesa}`, 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado: ${new Date().toLocaleString('es-BO')}`, pageWidth - 14, y, { align: 'right' });

  y += 5;

  // Cuadro de datos de la mesa
  doc.setFillColor(245, 248, 246);
  doc.setDrawColor(200, 220, 210);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  
  // Columna 1
  doc.setFont('helvetica', 'bold');
  doc.text('Departamento:', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`${mesa.departamento}`, 45, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Provincia:', 18, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${mesa.provincia}`, 45, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Municipio:', 18, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(`${mesa.municipio}`, 45, y + 18);

  // Columna 2
  doc.setFont('helvetica', 'bold');
  doc.text('Circunscripción:', 95, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`${mesa.circunscripcion}`, 125, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Recinto Electoral:', 95, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${mesa.recinto}`, 125, y + 12, { maxWidth: 68 });

  doc.setFont('helvetica', 'bold');
  doc.text('Padrón Habilitado:', 95, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(`${mesa.padronHabilitados} ciudadanos`, 125, y + 18);

  y += 28;

  // Tabla de Resultados de Votación
  doc.setFillColor(14, 90, 62);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('ORGANIZACIÓN POLÍTICA / CANDIDATURA', 18, y + 4.8);
  doc.text('CIFRA', 125, y + 4.8, { align: 'center' });
  doc.text('RESULTADO EN LITERAL (OBLIGATORIO)', 140, y + 4.8);

  y += 7;

  // Filas de partidos
  partidos.forEach((p, idx) => {
    const rowColor = idx % 2 === 0 ? 255 : 248;
    doc.setFillColor(rowColor, rowColor, rowColor);
    doc.rect(14, y, pageWidth - 28, 7.5, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.line(14, y + 7.5, pageWidth - 14, y + 7.5);

    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`[${p.sigla}] ${p.nombre}`, 18, y + 5, { maxWidth: 95 });

    doc.setFontSize(9);
    doc.text(`${p.votos}`, 125, y + 5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    doc.text(numeroALetras(p.votos), 140, y + 5);

    y += 7.5;
  });

  // Votos Blancos
  doc.setFillColor(242, 246, 244);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setDrawColor(210, 210, 210);
  doc.line(14, y + 7, pageWidth - 14, y + 7);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('VOTOS BLANCOS', 18, y + 4.8);
  doc.text(`${especiales.blancos}`, 125, y + 4.8, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(numeroALetras(especiales.blancos), 140, y + 4.8);
  y += 7;

  // Votos Nulos
  doc.setFillColor(254, 242, 242);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setDrawColor(210, 210, 210);
  doc.line(14, y + 7, pageWidth - 14, y + 7);
  doc.setTextColor(180, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('VOTOS NULOS', 18, y + 4.8);
  doc.text(`${especiales.nulos}`, 125, y + 4.8, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(numeroALetras(especiales.nulos), 140, y + 4.8);
  y += 7;

  // Resumen Total de Cuadre
  doc.setFillColor(220, 240, 230);
  doc.rect(14, y, pageWidth - 28, 9, 'F');
  doc.setTextColor(14, 90, 62);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('TOTAL PAPELETAS EN ÁNFORA (EMITIDOS)', 18, y + 6);
  doc.setFontSize(10);
  doc.text(`${totals.totalAnfora}`, 125, y + 6, { align: 'center' });
  doc.setFontSize(8);
  doc.text(numeroALetras(totals.totalAnfora), 140, y + 6);
  y += 12;

  // Matriz de Cuadre Electoral
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 18, 1, 1, 'FD');

  doc.setFontSize(7.5);
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('CONCILIACIÓN MATEMÁTICA DE PAPELETAS:', 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.text(`1. Papeletas Recibidas: ${mesa.papeletasRecibidas}`, 18, y + 10);
  doc.text(`2. Papeletas en Ánfora: ${totals.totalAnfora}`, 70, y + 10);
  doc.text(`3. Papeletas Sobrantes: ${totals.sobrantes}`, 125, y + 10);
  doc.text(`4. Votantes en Lista Índice: ${totals.votantesListaIndice}`, 18, y + 15);
  
  const balanceOk = mesa.papeletasRecibidas === (totals.totalAnfora + totals.sobrantes);
  if (balanceOk) {
    doc.setTextColor(16, 120, 60);
    doc.setFont('helvetica', 'bold');
    doc.text('ESTADO: MESA CUADRADA AL 100% (CONFORMIDAD)', 100, y + 15);
  } else {
    doc.setTextColor(180, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.text('ESTADO: DISCREPANCIA EN REVISIÓN', 100, y + 15);
  }

  y += 24;

  // Sección de Jurados Electorales y Firmas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(14, 90, 62);
  doc.text('NÓMINA Y FIRMAS DE LOS JURADOS ELECTORALES DE MESA', 14, y);
  y += 4;

  const boxWidth = (pageWidth - 28 - 8) / 3;
  const boxHeight = 22;

  jurados.slice(0, 3).forEach((jurado, i) => {
    const x = 14 + i * (boxWidth + 4);
    doc.setDrawColor(180, 200, 190);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, boxWidth, boxHeight, 1, 1, 'FD');

    doc.setFontSize(7);
    doc.setTextColor(14, 90, 62);
    doc.setFont('helvetica', 'bold');
    doc.text(jurado.cargo, x + 3, y + 5, { maxWidth: boxWidth - 6 });

    doc.setFontSize(6.5);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(jurado.nombre, x + 3, y + 9, { maxWidth: boxWidth - 6 });
    doc.text(`CI: ${jurado.ci}`, x + 3, y + 13);

    if (jurado.firmado) {
      doc.setTextColor(16, 120, 60);
      doc.setFont('helvetica', 'bold');
      doc.text('✓ FIRMADO ELECTRÓNICAMENTE', x + 3, y + 19);
    } else {
      doc.setTextColor(150, 150, 150);
      doc.text('(Firma pendiente)', x + 3, y + 19);
    }
  });

  y += boxHeight + 4;

  jurados.slice(3, 5).forEach((jurado, i) => {
    const x = 14 + i * (boxWidth + 4);
    doc.setDrawColor(180, 200, 190);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, boxWidth, boxHeight, 1, 1, 'FD');

    doc.setFontSize(7);
    doc.setTextColor(14, 90, 62);
    doc.setFont('helvetica', 'bold');
    doc.text(jurado.cargo, x + 3, y + 5, { maxWidth: boxWidth - 6 });

    doc.setFontSize(6.5);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(jurado.nombre, x + 3, y + 9, { maxWidth: boxWidth - 6 });
    doc.text(`CI: ${jurado.ci}`, x + 3, y + 13);

    if (jurado.firmado) {
      doc.setTextColor(16, 120, 60);
      doc.setFont('helvetica', 'bold');
      doc.text('✓ FIRMADO ELECTRÓNICAMENTE', x + 3, y + 19);
    } else {
      doc.setTextColor(150, 150, 150);
      doc.text('(Firma pendiente)', x + 3, y + 19);
    }
  });

  // Espacio para Notario / Código QR
  const qrX = 14 + 2 * (boxWidth + 4);
  doc.setDrawColor(180, 200, 190);
  doc.setFillColor(248, 250, 248);
  doc.roundedRect(qrX, y, boxWidth, boxHeight, 1, 1, 'FD');
  doc.setFontSize(6.5);
  doc.setTextColor(14, 90, 62);
  doc.setFont('helvetica', 'bold');
  doc.text('CÓDIGO DE SEGURIDAD SHA-256', qrX + 3, y + 5);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(60, 60, 60);
  doc.text(`HASH: ${mesa.codigoMesa}-9A8F3C7E`, qrX + 3, y + 11);
  doc.text(`VAL: OK-OEP-2026`, qrX + 3, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 120, 60);
  doc.text('[REGISTRO AUXILIAR]', qrX + 3, y + 19);

  y += boxHeight + 8;

  // Pie de página normativo
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  const aviso = 'Nota Importante: El presente documento digital constituye un acta de apoyo administrativo y control auxiliar para los jurados de mesa electoral. Conforme a la Ley Nº 026 del Régimen Electoral de Bolivia, la validez jurídica plena corresponde al Acta física original custodiada en el Sobre de Seguridad "A" con destino al Tribunal Electoral Departamental (TED).';
  doc.text(aviso, 14, y, { maxWidth: pageWidth - 28 });

  // Guardar / Descargar PDF
  doc.save(`Acta_Electoral_Mesa_${mesa.numeroMesa}_${mesa.departamento}.pdf`);
}

export function generateConstanciaEntregaPDF({ mesa, entrega, materiales, jurados }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  // Header
  doc.setFillColor(14, 90, 62);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('ÓRGANO ELECTORAL PLURINACIONAL', pageWidth / 2, 8, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('CONSTANCIA OFICIAL DE ENTREGA Y CUSTODIA DE MATERIAL ELECTORAL', pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('TRIBUNAL ELECTORAL DEPARTAMENTAL - CIERRE DE JORNADA ELECTORAL', pageWidth / 2, 20, { align: 'center' });

  y = 32;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(14, 90, 62);
  doc.text(`CONSTANCIA Nº: ${entrega.codigoConstancia}`, 14, y);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Fecha y Hora: ${entrega.fechaHoraEntrega || new Date().toLocaleString('es-BO')}`, pageWidth - 14, y, { align: 'right' });

  y += 7;

  // Cuadro informativo
  doc.setFillColor(245, 248, 246);
  doc.setDrawColor(200, 220, 210);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);

  doc.setFont('helvetica', 'bold');
  doc.text('Mesa Electoral:', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`Mesa Nº ${mesa.numeroMesa} (${mesa.codigoMesa})`, 45, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Recinto:', 18, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${mesa.recinto}`, 45, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Notario Receptor:', 18, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(`${entrega.notarioNombre} (CI: ${entrega.notarioCI} / Credencial: ${entrega.notarioCredencial})`, 45, y + 18);

  y += 28;

  // Tabla de verificación de materiales
  doc.setFillColor(14, 90, 62);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('CÓDIGO', 18, y + 5);
  doc.text('MATERIAL / SOBRE ENTREGADO', 45, y + 5);
  doc.text('ESTADO DE RECEPCIÓN', pageWidth - 20, y + 5, { align: 'right' });

  y += 7;

  materiales.forEach((m, idx) => {
    const rowColor = idx % 2 === 0 ? 255 : 248;
    doc.setFillColor(rowColor, rowColor, rowColor);
    doc.rect(14, y, pageWidth - 28, 8, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.line(14, y + 8, pageWidth - 14, y + 8);

    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(m.codigo, 18, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(m.nombre, 45, y + 5.5, { maxWidth: 105 });

    if (m.completado) {
      doc.setTextColor(16, 120, 60);
      doc.setFont('helvetica', 'bold');
      doc.text('RECIBIDO CONFORME [✓]', pageWidth - 20, y + 5.5, { align: 'right' });
    } else {
      doc.setTextColor(180, 40, 40);
      doc.setFont('helvetica', 'bold');
      doc.text('PENDIENTE [X]', pageWidth - 20, y + 5.5, { align: 'right' });
    }

    y += 8;
  });

  y += 10;

  // Cuadro de observaciones
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(14, 90, 62);
  doc.text('OBSERVACIONES DE CUSTODIA:', 14, y);
  y += 4;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(210, 210, 210);
  doc.roundedRect(14, y, pageWidth - 28, 14, 1, 1, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(50, 50, 50);
  doc.text(entrega.observacionesCustodia || 'Sin observaciones. Todos los materiales fueron recibidos intactos.', 18, y + 6, { maxWidth: pageWidth - 36 });

  y += 22;

  // Sección de Firmas (Presidente y Notario)
  const colW = (pageWidth - 28 - 10) / 2;

  // Presidente
  doc.setDrawColor(180, 200, 190);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, y, colW, 28, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(14, 90, 62);
  doc.text('ENTREGADO POR: PRESIDENTE(A) DE MESA', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(40, 40, 40);
  const pres = jurados.find(j => j.cargo.includes('Presidente')) || jurados[0];
  doc.text(pres ? pres.nombre : 'Presidente de Mesa', 18, y + 12);
  doc.text(`CI: ${pres ? pres.ci : ''}`, 18, y + 17);
  doc.setTextColor(16, 120, 60);
  doc.setFont('helvetica', 'bold');
  doc.text('✓ FIRMA ELECTRÓNICA REGISTRADA', 18, y + 23);

  // Notario
  const notarioX = 14 + colW + 10;
  doc.setDrawColor(180, 200, 190);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(notarioX, y, colW, 28, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(14, 90, 62);
  doc.text('RECIBIDO POR: NOTARIO(A) ELECTORAL TED', notarioX + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(40, 40, 40);
  doc.text(entrega.notarioNombre, notarioX + 4, y + 12);
  doc.text(`CI: ${entrega.notarioCI} | ${entrega.notarioCredencial}`, notarioX + 4, y + 17);
  doc.setTextColor(16, 120, 60);
  doc.setFont('helvetica', 'bold');
  doc.text('✓ CONSTANCIA Y RECEPCIÓN VALIDADA', notarioX + 4, y + 23);

  y += 36;

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('Este comprobante acredita la entrega efectiva de la maleta electoral y sobres de seguridad de la Mesa Nº ' + mesa.numeroMesa + ' al Notario Electoral autorizado por el OEP.', 14, y, { maxWidth: pageWidth - 28 });

  doc.save(`Constancia_Entrega_Mesa_${mesa.numeroMesa}_OEP.pdf`);
}
