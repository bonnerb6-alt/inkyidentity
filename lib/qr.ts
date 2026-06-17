import QRCode, { type QRCodeToStringOptions, type QRCodeToDataURLOptions, type QRCodeToBufferOptions } from 'qrcode';
import path from 'path';
import fs from 'fs';

const CACHE_DIR = path.join(process.cwd(), 'cache', 'qr');

/**
 * Canonical QR generation settings — the "latest QR generation".
 * Bump these (and regenerate from the admin panel) to roll out improvements.
 *
 *  - errorCorrectionLevel 'Q' = ~25% damage tolerance. Tuned for TATTOOS: it's
 *    a deliberate step down from 'H' (~30%) because the highest level packs in
 *    the most redundancy data, which means more/denser modules that are harder
 *    for an artist to ink cleanly and blur together as ink spreads. 'Q' keeps
 *    strong resilience while shedding ~20% of the modules. Levels, densest →
 *    simplest: H > Q > M > L.
 *  - margin 4 is the spec-mandated minimum "quiet zone". A smaller margin (the
 *    old value was 1) makes the code far harder for cameras to lock onto.
 */
export const QR_VERSION = 4; // bump whenever the settings below change
const QR_BASE = {
  errorCorrectionLevel: 'Q' as const,
  margin: 4,
  color: { dark: '#000000', light: '#ffffff' },
};

/**
 * Builds the URL that actually gets encoded into the QR. Kept as SHORT as
 * possible — every character can push the code to a denser "version" (more,
 * smaller modules), which is harder to ink as a tattoo.
 *
 *  - If NEXT_PUBLIC_SHORT_BASE_URL is set (e.g. "inky.id"), it's used as a
 *    short-link host → `<host>/<id>`. Smallest possible code. Requires that
 *    host to redirect `/<id>` → the main site's `/u/<id>`.
 *  - Otherwise we drop the `https://` scheme from the normal URL, shedding 8
 *    characters (e.g. `inkyidentity.com/u/<id>`). Phone cameras still open it
 *    as a link, and the browser re-adds https on the way to the server.
 */
export function qrTargetUrl(displayId: string, baseUrl: string): string {
  const short = process.env.NEXT_PUBLIC_SHORT_BASE_URL?.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  if (short) return `${short}/${displayId}`;
  return `${baseUrl.replace(/^https?:\/\//, '')}/u/${displayId}`;
}

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Returns the cached QR SVG for a user, generating (and caching) it on first
 * use. Pass `force: true` to ignore the cache and rebuild with the latest
 * settings — used by the admin "regenerate" action.
 */
export async function generateQRSvg(
  displayId: string,
  baseUrl: string,
  force = false,
): Promise<string> {
  ensureCacheDir();
  const url = qrTargetUrl(displayId, baseUrl);
  const filePath = path.join(CACHE_DIR, `${displayId}.svg`);

  if (!force && fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }

  const svg = await QRCode.toString(url, { type: 'svg', ...QR_BASE } as QRCodeToStringOptions);

  fs.writeFileSync(filePath, svg);
  return svg;
}

export async function getQRDataUrl(displayId: string, baseUrl: string): Promise<string> {
  const url = qrTargetUrl(displayId, baseUrl);
  return QRCode.toDataURL(url, { width: 400, ...QR_BASE } as QRCodeToDataURLOptions);
}

export async function getQRBuffer(url: string, width: number): Promise<Buffer> {
  return QRCode.toBuffer(url, { width, ...QR_BASE } as QRCodeToBufferOptions);
}

/**
 * Deletes cached QR SVGs so they rebuild with the latest settings on next use.
 * Pass a `displayId` to clear one user, or omit it to clear every cached code.
 * Returns the number of cache files removed.
 */
export function clearQRCache(displayId?: string): number {
  if (!fs.existsSync(CACHE_DIR)) return 0;

  if (displayId) {
    const filePath = path.join(CACHE_DIR, `${displayId}.svg`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return 1;
    }
    return 0;
  }

  let removed = 0;
  for (const file of fs.readdirSync(CACHE_DIR)) {
    if (file.endsWith('.svg')) {
      fs.unlinkSync(path.join(CACHE_DIR, file));
      removed++;
    }
  }
  return removed;
}
