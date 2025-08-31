// Application constants
export const APP_CONFIG = {
  name: 'TV a la Carta',
  version: '2.0.0',
  description: 'Películas y series ilimitadas y mucho más',
  contact: {
    phone: '+5354690878',
    whatsapp: '5354690878'
  },
  urls: {
    production: 'https://tvalacarta.vercel.app/',
    admin: '/admin'
  }
} as const;

export const STORAGE_KEYS = {
  cart: 'movieCart',
  adminState: 'admin_system_state',
  contentVideos: 'content_videos',
  pageRefreshed: 'pageRefreshed'
} as const;

export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  carousel: 6000
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export const DEFAULT_PRICES = {
  moviePrice: 80,
  seriesPrice: 300,
  transferFeePercentage: 10,
  novelPricePerChapter: 5
} as const;

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
} as const;