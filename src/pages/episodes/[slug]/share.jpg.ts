// Social share image for an episode: the episode's `shareImage` fitted (never cropped) into 1200×630,
// with the empty space filled in the colour of the image's top-left pixel. Square episode art stays whole.
import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { getEpisodes, type Episode } from '../../../lib/episodes';

export const getStaticPaths = (async () =>
  (await getEpisodes())
    .filter((episode) => episode.data.shareImage)
    .map((episode) => ({ params: { slug: episode.id }, props: { episode } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { episode } = props as { episode: Episode };
  // Astro keeps the source file path on image metadata (non-enumerable).
  const file = (episode.data.shareImage as unknown as { fsPath: string }).fsPath;
  const { data } = await sharp(file).extract({ left: 0, top: 0, width: 1, height: 1 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const jpg = await sharp(file)
    .flatten({ background: { r: data[0], g: data[1], b: data[2] } })
    .resize(1200, 630, { fit: 'contain', background: { r: data[0], g: data[1], b: data[2] } })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
};
