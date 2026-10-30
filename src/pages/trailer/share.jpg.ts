// Social share image for the trailer: the show's cover art, fitted into 1200×630.
import type { APIRoute } from 'astro';
import cover from '../../assets/cover.png';
import { shareJpg } from '../../lib/share-image';

export const GET: APIRoute = () => shareJpg(cover);
