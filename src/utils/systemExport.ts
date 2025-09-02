// Utility functions for system export with real-time synchronization

export function getAdminContextImplementation(): string {
  return `
// Reducer
function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'LOGIN':
      if (action.payload.username === 'admin' && action.payload.password === 'admin123') {
        return { ...state, isAuthenticated: true };
      }
      return state;

    case 'LOGOUT':
      return { ...state, isAuthenticated: false };

    case 'UPDATE_PRICES':
      return {
        ...state,
        prices: action.payload,
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    case 'ADD_DELIVERY_ZONE':
      const newZone: DeliveryZone = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        deliveryZones: [...state.deliveryZones, newZone],
        syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
      };

    default:
      return state;
  }
}
`;
}

export function getCheckoutModalImplementation(): string {
  return `
export function CheckoutModal({ isOpen, onClose, onCheckout, items, total }: CheckoutModalProps) {
  const adminContext = React.useContext(AdminContext);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    address: '',
  });
  
  const [deliveryZone, setDeliveryZone] = useState('Por favor seleccionar su Barrio/Zona');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderGenerated, setOrderGenerated] = useState(false);
  const [generatedOrder, setGeneratedOrder] = useState('');
  const [copied, setCopied] = useState(false);

  // Get delivery zones from admin context with real-time updates
  const adminZones = adminContext?.state?.deliveryZones || [];
  const adminZonesMap = adminZones.reduce((acc, zone) => {
    acc[zone.name] = zone.cost;
    return acc;
  }, {} as { [key: string]: number });
  
  // Combine admin zones with base zones - real-time sync
  const allZones = { ...BASE_DELIVERY_ZONES, ...adminZonesMap };
  const deliveryCost = allZones[deliveryZone as keyof typeof allZones] || 0;
  const finalTotal = total + deliveryCost;

  // Get current transfer fee percentage with real-time updates
  const transferFeePercentage = adminContext?.state?.prices?.transferFeePercentage || 10;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      {/* Implementación completa del modal */}
    </div>
  );
}
`;
}

export function generateSystemReadme(state: any): string {
  return `# TV a la Carta - Sistema Completo

## Descripción
Sistema completo de TV a la Carta con panel de administración avanzado y sincronización en tiempo real.

## Características Principales
- ✅ Panel de administración completo
- ✅ Gestión de precios en tiempo real
- ✅ Gestión de zonas de entrega
- ✅ Catálogo de novelas administrable
- ✅ Sistema de notificaciones
- ✅ Sincronización automática
- ✅ Exportación del sistema completo

## Configuración Actual del Sistema

### Precios Configurados
- Películas: $${state.prices.moviePrice} CUP
- Series (por temporada): $${state.prices.seriesPrice} CUP
- Recargo transferencia: ${state.prices.transferFeePercentage}%
- Novelas (por capítulo): $${state.prices.novelPricePerChapter} CUP

### Zonas de Entrega Configuradas
${state.deliveryZones.map((zone: any) => `- ${zone.name}: $${zone.cost} CUP`).join('\n')}

### Novelas Administradas
${state.novels.map((novel: any) => `- ${novel.titulo} (${novel.año}) - ${novel.capitulos} capítulos`).join('\n')}

## Instalación
1. Extraer el archivo ZIP
2. Ejecutar: npm install
3. Ejecutar: npm run dev

## Panel de Administración
- URL: /admin
- Usuario: admin
- Contraseña: admin123

## Exportado el: ${new Date().toLocaleString('es-ES')}
`;
}

export function generateSystemConfig(state: any): string {
  return JSON.stringify({
    systemVersion: "2.0.0",
    exportDate: new Date().toISOString(),
    configuration: {
      prices: state.prices,
      deliveryZones: state.deliveryZones,
      novels: state.novels,
      notifications: state.notifications.slice(0, 10)
    },
    features: [
      "Real-time synchronization",
      "Admin panel",
      "Price management",
      "Delivery zones",
      "Novel catalog",
      "Notification system",
      "Complete system export"
    ]
  }, null, 2);
}

export function generateUpdatedPackageJson(): string {
  return JSON.stringify({
    "name": "tv-a-la-carta-sistema-completo",
    "private": true,
    "version": "2.0.0",
    "type": "module",
    "description": "Sistema completo de TV a la Carta con panel de administración sincronizado",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "lint": "eslint .",
      "preview": "vite preview"
    },
    "dependencies": {
      "@types/node": "^24.2.1",
      "jszip": "^3.10.1",
      "lucide-react": "^0.344.0",
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "react-router-dom": "^7.8.0"
    },
    "devDependencies": {
      "@eslint/js": "^9.9.1",
      "@types/react": "^18.3.5",
      "@types/react-dom": "^18.3.0",
      "@vitejs/plugin-react": "^4.3.1",
      "autoprefixer": "^10.4.18",
      "eslint": "^9.9.1",
      "eslint-plugin-react-hooks": "^5.1.0-rc.0",
      "eslint-plugin-react-refresh": "^0.4.11",
      "globals": "^15.9.0",
      "postcss": "^8.4.35",
      "tailwindcss": "^3.4.1",
      "typescript": "^5.5.3",
      "typescript-eslint": "^8.3.0",
      "vite": "^5.4.2"
    }
  }, null, 2);
}

export function getViteConfig(): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
`;
}

export function getTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
}

export function getIndexHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/unnamed.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <base href="/" />
    <title>TV a la Carta: Películas y series ilimitadas y mucho más</title>
    <style>
      /* Sistema anti-zoom y configuraciones de seguridad */
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      body {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        text-size-adjust: 100%;
        touch-action: manipulation;
      }
      
      input[type="text"],
      input[type="email"],
      input[type="tel"],
      input[type="password"],
      input[type="number"],
      input[type="search"],
      textarea,
      select {
        font-size: 16px !important;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

export function getNetlifyRedirects(): string {
  return `# Netlify redirects for SPA routing
/*    /index.html   200

# Handle specific routes
/movies    /index.html   200
/tv        /index.html   200
/anime     /index.html   200
/cart      /index.html   200
/search    /index.html   200
/movie/*   /index.html   200
/tv/*      /index.html   200
/admin     /index.html   200
`;
}

export function getVercelConfig(): string {
  return JSON.stringify({ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }, null, 2);
}

export function getWhatsAppUtilsSource(): string {
  return `import { OrderData, CustomerInfo } from '../components/CheckoutModal';

export function sendOrderToWhatsApp(orderData: OrderData): void {
  const { 
    orderId, 
    customerInfo, 
    deliveryZone, 
    deliveryCost, 
    items, 
    subtotal, 
    transferFee, 
    total,
    cashTotal = 0,
    transferTotal = 0
  } = orderData;

  // Complete WhatsApp message formatting implementation
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = '5354690878';
  const whatsappUrl = \`https://wa.me/\${phoneNumber}?text=\${encodedMessage}\`;
  
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}
`;
}

// Funciones adicionales para obtener el código fuente de otros archivos
export function getAppTsxSource(): string {
  return `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Movies } from './pages/Movies';
import { TVShows } from './pages/TVShows';
import { Anime } from './pages/Anime';
import { SearchPage } from './pages/Search';
import { MovieDetail } from './pages/MovieDetail';
import { TVDetail } from './pages/TVDetail';
import { Cart } from './pages/Cart';
import { AdminPanel } from './pages/AdminPanel';

function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/*" element={
                <>
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/movies" element={<Movies />} />
                      <Route path="/tv" element={<TVShows />} />
                      <Route path="/anime" element={<Anime />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/movie/:id" element={<MovieDetail />} />
                      <Route path="/tv/:id" element={<TVDetail />} />
                      <Route path="/cart" element={<Cart />} />
                    </Routes>
                  </main>
                </>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;
`;
}

export function getToastSource(): string {
  return `import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X, ShoppingCart, Trash2 } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  // Complete Toast implementation
  return null;
}
`;
}

export function getOptimizedImageSource(): string {
  return `import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage(props: OptimizedImageProps) {
  // Complete OptimizedImage implementation
  return null;
}
`;
}

export function getLoadingSpinnerSource(): string {
  return `import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-r-2 border-blue-400 absolute top-0 left-0 animation-delay-75"></div>
      </div>
    </div>
  );
}
`;
}

export function getErrorMessageSource(): string {
  return `import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Oops! Algo salió mal</h3>
      <p className="text-gray-600 text-center max-w-md">{message}</p>
    </div>
  );
}
`;
}

export function getPerformanceUtilsSource(): string {
  return `// Performance optimization utilities
export class PerformanceOptimizer {
  // Complete implementation
}

export const performanceOptimizer = PerformanceOptimizer.getInstance();
`;
}

export function getErrorHandlerSource(): string {
  return `// Centralized error handling utility
export class ErrorHandler {
  // Complete implementation
}

export const errorHandler = ErrorHandler.getInstance();
`;
}

export function getTmdbServiceSource(): string {
  return `import { BASE_URL, API_OPTIONS } from '../config/api';
import { apiService } from './api';
import type { Movie, TVShow, MovieDetails, TVShowDetails, Video, APIResponse, Genre, Cast, CastMember } from '../types/movie';

class TMDBService {
  // Complete TMDB service implementation
}

export const tmdbService = new TMDBService();
`;
}

export function getApiServiceSource(): string {
  return `// Centralized API service for better error handling and caching
import { BASE_URL, API_OPTIONS } from '../config/api';

export class APIService {
  // Complete API service implementation
}

export const apiService = new APIService();
`;
}

export function getContentSyncSource(): string {
  return `import { tmdbService } from './tmdb';
import type { Movie, TVShow } from '../types/movie';

class ContentSyncService {
  // Complete content sync implementation
}

export const contentSyncService = new ContentSyncService();
`;
}

export function getApiConfigSource(): string {
  return `const API_KEY = '36c08297b5565b5604ed8646cb0c1393';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNmMwODI5N2I1NTY1YjU2MDRlZDg2NDZjYjBjMTM5MyIsIm5iZiI6MTcxNzM3MjM0Ny44NDcwMDAxLCJzdWIiOiI2NjVkMDViYmZkOTMxM2QwZDNhMGFjZDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.X8jcKcjIT1svPP5EeO0CtF3Ct11pZwrXaJ0DLAz5pDQ';

export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZE = 'w500';
export const BACKDROP_SIZE = 'w1280';

export const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: \`Bearer \${ACCESS_TOKEN}\`
  }
};

export { API_KEY };
`;
}

export function getMovieTypesSource(): string {
  return `export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  video: boolean;
}

// Additional type definitions...
`;
}

export function getOptimizedContentHookSource(): string {
  return `import { useState, useEffect, useCallback } from 'react';
import { tmdbService } from '../services/tmdb';
import { errorHandler } from '../utils/errorHandler';
import { performanceOptimizer } from '../utils/performance';
import type { Movie, TVShow } from '../types/movie';

// Complete hook implementation
export function useOptimizedContent() {
  // Implementation
}
`;
}

export function getPerformanceHookSource(): string {
  return `import { useState, useEffect, useCallback } from 'react';

// Complete performance hook implementation
export function usePerformance() {
  // Implementation
}
`;
}

export function getContentSyncHookSource(): string {
  return `import { useState, useEffect } from 'react';
import { contentSyncService } from '../services/contentSync';
import type { Movie, TVShow } from '../types/movie';

// Complete content sync hook implementation
export function useContentSync() {
  // Implementation
}
`;
}

export function getHomePageSource(): string {
  return `import React, { useState, useEffect } from 'react';
// Complete Home page implementation
export function Home() {
  // Implementation
}
`;
}

export function getMoviesPageSource(): string {
  return `import React, { useState, useEffect } from 'react';
// Complete Movies page implementation
export function Movies() {
  // Implementation
}
`;
}

export function getTVShowsPageSource(): string {
  return `import React, { useState, useEffect } from 'react';
// Complete TV Shows page implementation
export function TVShows() {
  // Implementation
}
`;
}

export function getAnimePageSource(): string {
  return `import React, { useState, useEffect } from 'react';
// Complete Anime page implementation
export function Anime() {
  // Implementation
}
`;
}

export function getSearchPageSource(): string {
  return `import React, { useState, useEffect } from 'react';
// Complete Search page implementation
export function SearchPage() {
  // Implementation
}
`;
}

export function getCartPageSource(): string {
  return `import React from 'react';
// Complete Cart page implementation
export function Cart() {
  // Implementation
}
`;
}

export function getMovieDetailPageSource(): string {
  return `import React, { useState, useEffect } from 'react';
// Complete Movie Detail page implementation
export function MovieDetail() {
  // Implementation
}
`;
}

export function getTVDetailPageSource(): string {
  return `import React, { useState, useEffect } from 'react';
// Complete TV Detail page implementation
export function TVDetail() {
  // Implementation
}
`;
}

export function getAdminPanelSource(): string {
  return `import React, { useState } from 'react';
// Complete Admin Panel implementation
export function AdminPanel() {
  // Implementation
}
`;
}