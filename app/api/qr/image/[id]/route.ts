import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import sharp from 'sharp';

/**
 * Public endpoint that returns the QR code as a PNG image with
 * "InkyIdentity.com" text below — used by Prodigi as the print asset.
 * e.g. GET /api/qr/image/3Urka6Kh
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://inkyidentity.com';
  const url = `${baseUrl}/u/${id}`;

  const QR_SIZE = 1100;
  const PADDING = 40;
  const TEXT_HEIGHT = 80;
  const TOTAL_WIDTH = QR_SIZE + PADDING * 2;
  const TOTAL_HEIGHT = QR_SIZE + PADDING * 2 + TEXT_HEIGHT;
  const FONT_SIZE = 48;

  // Generate QR code as PNG buffer
  const qrBuffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: QR_SIZE,
    color: { dark: '#000000', light: '#ffffff' },
  });

  // Build SVG with QR image embedded + text below
  const qrBase64 = qrBuffer.toString('base64');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      width="${TOTAL_WIDTH}" height="${TOTAL_HEIGHT}">
      <rect width="${TOTAL_WIDTH}" height="${TOTAL_HEIGHT}" fill="white"/>
      <image x="${PADDING}" y="${PADDING}" width="${QR_SIZE}" height="${QR_SIZE}"
        xlink:href="data:image/png;base64,${qrBase64}"/>
      <text
        x="${TOTAL_WIDTH / 2}"
        y="${PADDING + QR_SIZE + TEXT_HEIGHT / 2 + FONT_SIZE / 3}"
        font-family="Arial, Helvetica, sans-serif"
        font-size="${FONT_SIZE}"
        font-weight="bold"
        fill="#111111"
        text-anchor="middle"
        letter-spacing="2">InkyIdentity.com</text>
    </svg>
  `;

  const buffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
