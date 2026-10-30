import sharp from 'sharp';

/**
 * Fit an image (e.g. square episode art) uncropped into a 1200×630 social share JPG, filling the empty space
 * with the colour of its top-left pixel. `image` is Astro image metadata; Astro keeps the source path on it.
 */
export async function shareJpg(image: unknown): Promise<Response> {
  const file = (image as { fsPath: string }).fsPath;
  const { data } = await sharp(file).extract({ left: 0, top: 0, width: 1, height: 1 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const background = { r: data[0], g: data[1], b: data[2] };
  const jpg = await sharp(file).flatten({ background }).resize(1200, 630, { fit: 'contain', background }).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
}
