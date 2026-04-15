import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

const CACHE_DIR = path.join(process.cwd(), 'cache', 'qr');

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export async function generateQRSvg(displayId: string, baseUrl: string): Promise<string> {
  ensureCacheDir();
  const url = `${baseUrl}/u/${displayId}`;
  const filePath = path.join(CACHE_DIR, `${displayId}.svg`);

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }

  const svg = await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
  });

  fs.writeFileSync(filePath, svg);
  return svg;
}

export async function getQRDataUrl(displayId: string, baseUrl: string): Promise<string> {
  const url = `${baseUrl}/u/${displayId}`;
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 400,
    color: { dark: '#000000', light: '#ffffff' },
  });
}
