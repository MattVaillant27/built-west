// Site-wide settings. Update these as details are confirmed.
export const SITE = {
  name: 'Built West',
  tagline: 'A BC Tech Podcast',
  description: 'Long-form conversations with the people building BC tech.',
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
    metaDomainVerification: '', // content value of Meta's facebook-domain-verification tag
  },
  listen: [
    { label: 'Apple Podcasts', href: '' },
    { label: 'Spotify', href: '' },
    { label: 'YouTube', href: '' },
  ],
};
