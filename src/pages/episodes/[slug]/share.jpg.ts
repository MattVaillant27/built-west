// Social share image for an episode: its `shareImage`, fitted uncropped into 1200×630 (see lib/share-image.ts).
import type { APIRoute, GetStaticPaths } from 'astro';
import { getEpisodes, type Episode } from '../../../lib/episodes';
import { shareJpg } from '../../../lib/share-image';

export const getStaticPaths = (async () =>
  (await getEpisodes())
    .filter((episode) => episode.data.shareImage)
    .map((episode) => ({ params: { slug: episode.id }, props: { episode } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => shareJpg((props as { episode: Episode }).episode.data.shareImage);
