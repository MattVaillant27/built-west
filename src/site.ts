// Site-wide settings. Update these as details are confirmed.
export const SITE = {
  name: 'Built West',
  legalName: 'Built West Media Inc.',
  tagline: 'A BC Tech Podcast',
  description: 'Long-form conversations with the people building BC tech.',
  // Default meta description for search results (~150 characters).
  seoDescription:
    'Built West is a long-form interview podcast with the founders, operators and investors building tech in British Columbia, from Vancouver to Victoria and beyond.',
  url: 'https://builtwest.ca',
  email: 'hello@builtwest.ca', // TODO: confirm
  host: { name: 'Matt Vaillant', role: 'Host' },
  // Flip to true once the first episode is published: home page switches to "latest episode".
  launched: false,
  nav: [
    { label: 'Episodes', href: '/episodes/' },
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
  ],
  // Empty strings are hidden.
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/builtwest' },
    { label: 'YouTube', href: 'https://www.youtube.com/@builtwest' },
    { label: 'Instagram', href: 'https://www.instagram.com/builtwestBC' },
    { label: 'X', href: 'https://x.com/BuiltWestBC' },
  ],
  // Analytics/ad IDs. Empty = off. Nothing loads before cookie consent (see src/components/Tracking.astro).
  tracking: {
    ga4: 'G-PPNKCC73CS', // Google Analytics 4 Measurement ID, e.g. G-XXXXXXXXXX
    metaPixel: '1444701464201483', // Meta (Instagram/Facebook) dataset/pixel ID
    metaDomainVerification: 'xa11jb4r1l8i2iz4aebj62w87gzobv', // content value of Meta's facebook-domain-verification tag
  },
  // Show pages. Short links /apple and /spotify redirect here (netlify.toml).
  listen: [
    { label: 'Apple Podcasts', href: 'https://podcasts.apple.com/ca/podcast/built-west/id6828986217' },
    { label: 'Spotify', href: 'https://open.spotify.com/show/7CQdrTef34eOpHZgRaHD1U' },
    { label: 'YouTube', href: '' },
  ],
  // Riverside hosting feed (Apple and Spotify read from it).
  rss: 'https://api.riverside.com/hosting/jquYMErJ.rss',
  // The show trailer (/trailer/). Copy and audio from the Riverside feed.
  trailer: {
    title: 'Built West Trailer',
    date: '2026-10-30',
    duration: '52 sec',
    audio:
      'https://api.riverside.com/hosting-analytics/media/68140cfec6fdfd08d8f674e8876b18fe5c1023b90f5fc91edf6e15d05617f52a/eyJlcGlzb2RlSWQiOiIwNDQzZjEyZi1hNDU2LTRhYzEtOGM3ZC1lODI0NjFjNmI3OTIiLCJwb2RjYXN0SWQiOiI5ZjUxODZmOS1jM2M2LTRlNGUtOGI1OC1jOGI2NzhjNDYxMjMiLCJhY2NvdW50SWQiOiI2YWJhNzE3YTc3MWQ1NDU2ZTYyMzYxYjciLCJwYXRoIjoibWVkaWEvY2xpcHMvNmFlMzgxZWMyOGUzZDlhMzg1ZDk3OGVhL21hdHQtdmFpbGxhbnRzLXN0dWRpby0yMDI2LTEwLTMwX18xNy01MC0zMi5tcDMifQ==.mp3',
    apple: 'https://podcasts.apple.com/ca/podcast/built-west-trailer/id6828986217?i=1000798936870',
    spotify: 'https://open.spotify.com/episode/1Csgcq2ONPYK73eWliQJQ8',
    description: [
      'Built West is a podcast about the people building British Columbia’s tech scene.',
      'Every two weeks, host Matt Vaillant sits down with founders, operators and investors for unfiltered conversations about the parts the funding announcements leave out: cash flow pinches, product mistakes, why talent leaves or stays in BC, and imposter syndrome.',
      'It also gets personal: how do you build something that matters without losing your family, health or mind along the way?',
    ],
  },
};
