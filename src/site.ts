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
  // TODO: add real URLs. Empty strings are hidden.
  social: [
    { label: 'LinkedIn', href: '' },
    { label: 'Instagram', href: '' },
    { label: 'YouTube', href: '' },
  ],
  listen: [
    { label: 'Apple Podcasts', href: '' },
    { label: 'Spotify', href: '' },
    { label: 'YouTube', href: '' },
  ],
};
