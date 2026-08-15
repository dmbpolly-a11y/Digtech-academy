import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

interface CertificateData {
  studentName: string;
  courseTitle: string;
  tutorName: string;
  issuedDate: string; // formatted, e.g. "1 August 2026"
  verificationCode: string;
  verifyUrl: string;
}

/**
 * Renders a landscape A4 certificate as a PDF byte buffer, with a QR code
 * in the corner linking to the public verification page
 * (see src/app/verify/[code]/page.tsx) so employers can confirm authenticity.
 */
export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([842, 595]); // A4 landscape in points
  const { width, height } = page.getSize();

  const serif = await doc.embedFont(StandardFonts.TimesRomanBold);
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await doc.embedFont(StandardFonts.Helvetica);

  const navy = rgb(0x1a / 255, 0x40 / 255, 0x95 / 255);
  const gold = rgb(0xf2 / 255, 0xa9 / 255, 0x3b / 255);
  const ink = rgb(0x1f / 255, 0x29 / 255, 0x37 / 255);

  // border
  page.drawRectangle({ x: 20, y: 20, width: width - 40, height: height - 40, borderColor: navy, borderWidth: 3 });
  page.drawRectangle({ x: 30, y: 30, width: width - 60, height: height - 60, borderColor: gold, borderWidth: 1.5 });

  page.drawText('DIGTECH ACADEMY', { x: width / 2 - 140, y: height - 90, size: 26, font: serif, color: navy });
  page.drawText('Certificate of Completion', {
    x: width / 2 - 130,
    y: height - 125,
    size: 16,
    font: sans,
    color: ink
  });

  page.drawText('This certifies that', { x: width / 2 - 60, y: height - 200, size: 12, font: sans, color: ink });
  page.drawText(data.studentName, {
    x: width / 2 - (data.studentName.length * 7),
    y: height - 235,
    size: 28,
    font: serif,
    color: navy
  });
  page.drawText('has successfully completed the course', {
    x: width / 2 - 115,
    y: height - 265,
    size: 12,
    font: sans,
    color: ink
  });
  page.drawText(`"${data.courseTitle}"`, {
    x: width / 2 - (data.courseTitle.length * 4.2),
    y: height - 295,
    size: 18,
    font: serifItalic,
    color: navy
  });

  page.drawText(`Tutor: ${data.tutorName}`, { x: 80, y: 110, size: 11, font: sans, color: ink });
  page.drawText(`Issued: ${data.issuedDate}`, { x: 80, y: 92, size: 11, font: sans, color: ink });
  page.drawText(`Verification code: ${data.verificationCode}`, { x: 80, y: 74, size: 11, font: sans, color: ink });

  const qrDataUrl = await QRCode.toDataURL(data.verifyUrl, { margin: 1, width: 140 });
  const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  const qrImage = await doc.embedPng(qrImageBytes);
  page.drawImage(qrImage, { x: width - 190, y: 60, width: 100, height: 100 });
  page.drawText('Scan to verify', { x: width - 175, y: 48, size: 9, font: sans, color: ink });

  return doc.save();
}
