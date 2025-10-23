interface FileEntry {
  path: string;
  content: string;
}

interface ProjectStructure {
  sourceFiles: FileEntry[];
  configFiles: FileEntry[];
  publicFiles: FileEntry[];
}

export const ALL_PROJECT_FILES = {
  source: [
    'src/main.tsx',
    'src/App.tsx',
    'src/index.css',
    'src/vite-env.d.ts',
    'src/components/CastSection.tsx',
    'src/components/CheckoutModal.tsx',
    'src/components/ErrorMessage.tsx',
    'src/components/FloatingNav.tsx',
    'src/components/Header.tsx',
    'src/components/HeroCarousel.tsx',
    'src/components/LoadingSpinner.tsx',
    'src/components/MovieCard.tsx',
    'src/components/NetflixNovelSection.tsx',
    'src/components/NetflixSection.tsx',
    'src/components/NovelasModal.tsx',
    'src/components/NovelCard.tsx',
    'src/components/OptimizedImage.tsx',
    'src/components/PriceCard.tsx',
    'src/components/Toast.tsx',
    'src/components/VideoPlayer.tsx',
    'src/config/api.ts',
    'src/context/AdminContext.tsx',
    'src/context/CartContext.tsx',
    'src/hooks/useContentSync.ts',
    'src/hooks/useOptimizedContent.ts',
    'src/hooks/usePerformance.ts',
    'src/pages/AdminPanel.tsx',
    'src/pages/Anime.tsx',
    'src/pages/Cart.tsx',
    'src/pages/Home.tsx',
    'src/pages/MovieDetail.tsx',
    'src/pages/Movies.tsx',
    'src/pages/NovelDetail.tsx',
    'src/pages/Search.tsx',
    'src/pages/TVDetail.tsx',
    'src/pages/TVShows.tsx',
    'src/services/api.ts',
    'src/services/contentFilter.ts',
    'src/services/contentSync.ts',
    'src/services/tmdb.ts',
    'src/types/movie.ts',
    'src/utils/errorHandler.ts',
    'src/utils/fileSystemReader.ts',
    'src/utils/performance.ts',
    'src/utils/sourceCodeGenerator.ts',
    'src/utils/systemExport.ts',
    'src/utils/whatsapp.ts'
  ],
  config: [
    'package.json',
    'vite.config.ts',
    'tailwind.config.js',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'postcss.config.js',
    'eslint.config.js',
    'index.html',
    'vercel.json',
    '.gitignore',
    '.env'
  ],
  public: [
    'public/_redirects'
  ]
};

export async function readProjectFiles(): Promise<ProjectStructure> {
  const structure: ProjectStructure = {
    sourceFiles: [],
    configFiles: [],
    publicFiles: []
  };

  const readFileViaFetch = async (filePath: string, maxRetries = 3): Promise<string | null> => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(`/${filePath}?t=${Date.now()}&attempt=${attempt}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (response.ok) {
          const text = await response.text();
          return text;
        }
      } catch (error) {
        if (attempt === maxRetries) {
          console.warn(`Could not read ${filePath} after ${maxRetries + 1} attempts:`, error);
        }
        await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
      }
    }
    return null;
  };

  try {
    const sourcePromises = ALL_PROJECT_FILES.source.map(async (filePath) => {
      const content = await readFileViaFetch(filePath);
      if (content !== null && content.trim()) {
        structure.sourceFiles.push({ path: filePath, content });
      }
    });

    const configPromises = ALL_PROJECT_FILES.config.map(async (filePath) => {
      const content = await readFileViaFetch(filePath);
      if (content !== null && content.trim()) {
        structure.configFiles.push({ path: filePath, content });
      }
    });

    const publicPromises = ALL_PROJECT_FILES.public.map(async (filePath) => {
      const content = await readFileViaFetch(filePath);
      if (content !== null && content.trim()) {
        structure.publicFiles.push({ path: filePath, content });
      }
    });

    await Promise.all([...sourcePromises, ...configPromises, ...publicPromises]);

    console.log('Files read successfully:', {
      sourceFiles: structure.sourceFiles.length,
      configFiles: structure.configFiles.length,
      publicFiles: structure.publicFiles.length
    });
  } catch (error) {
    console.error('Error reading project files:', error);
  }

  return structure;
}

export function injectConfigIntoFile(fileContent: string, config: any, filePath: string): string {
  try {
    if (filePath.includes('AdminContext.tsx')) {
      const initialStateMatch = fileContent.match(/const\s+initialState:\s*AdminState\s*=\s*\{[\s\S]*?\n\};/m);
      if (initialStateMatch) {
        const configData = {
          isAuthenticated: false,
          prices: config.prices || { moviePrice: 80, seriesPrice: 300, transferFeePercentage: 10, novelPricePerChapter: 5 },
          deliveryZones: config.deliveryZones || [],
          novels: config.novels || [],
          notifications: [],
          systemConfig: {
            version: config.version || '2.1.0',
            settings: config.settings || {
              autoSync: true,
              syncInterval: 300000,
              enableNotifications: true,
              maxNotifications: 100
            },
            metadata: config.metadata || {}
          },
          syncStatus: config.syncStatus || {
            lastSync: new Date().toISOString(),
            isOnline: true,
            pendingChanges: 0
          }
        };

        const updatedInitialState = `const initialState: AdminState = ${JSON.stringify(configData, null, 2)};`;
        return fileContent.replace(initialStateMatch[0], updatedInitialState);
      }
    }

    if (filePath.includes('CartContext.tsx')) {
      let updated = fileContent;

      if (config.prices?.moviePrice !== undefined) {
        updated = updated.replace(/moviePrice:\s*\d+/g, `moviePrice: ${config.prices.moviePrice}`);
      }
      if (config.prices?.seriesPrice !== undefined) {
        updated = updated.replace(/seriesPrice:\s*\d+/g, `seriesPrice: ${config.prices.seriesPrice}`);
      }
      if (config.prices?.transferFeePercentage !== undefined) {
        updated = updated.replace(/transferFeePercentage:\s*\d+/g, `transferFeePercentage: ${config.prices.transferFeePercentage}`);
      }
      if (config.prices?.novelPricePerChapter !== undefined) {
        updated = updated.replace(/novelPricePerChapter:\s*\d+/g, `novelPricePerChapter: ${config.prices.novelPricePerChapter}`);
      }
      return updated;
    }

    if (filePath.includes('CheckoutModal.tsx')) {
      const deliveryZonesMatch = fileContent.match(/const\s+deliveryZones:\s*\w+\[\]\s*=\s*\[[\s\S]*?\];/);
      if (deliveryZonesMatch && config.deliveryZones && config.deliveryZones.length > 0) {
        const updatedZones = `const deliveryZones: any[] = ${JSON.stringify(config.deliveryZones, null, 2)};`;
        return fileContent.replace(deliveryZonesMatch[0], updatedZones);
      }
    }

    if (filePath.includes('NovelasModal.tsx')) {
      const novelsMatch = fileContent.match(/const\s+novelas:\s*\w+\[\]\s*=\s*\[[\s\S]*?\];/);
      if (novelsMatch && config.novels && config.novels.length > 0) {
        const updatedNovels = `const novelas: any[] = ${JSON.stringify(config.novels, null, 2)};`;
        return fileContent.replace(novelsMatch[0], updatedNovels);
      }
    }

    if (filePath.includes('PriceCard.tsx')) {
      let updated = fileContent;
      if (config.prices?.moviePrice !== undefined) {
        updated = updated.replace(/price:\s*\d+,?\s*\/\/\s*Películas/g, `price: ${config.prices.moviePrice}, // Películas`);
        updated = updated.replace(/80\s*\/\/\s*precio.*película/gi, `${config.prices.moviePrice} // precio por película`);
      }
      if (config.prices?.seriesPrice !== undefined) {
        updated = updated.replace(/price:\s*\d+,?\s*\/\/\s*Series/g, `price: ${config.prices.seriesPrice}, // Series`);
        updated = updated.replace(/300\s*\/\/\s*precio.*serie/gi, `${config.prices.seriesPrice} // precio por serie`);
      }
      if (config.prices?.novelPricePerChapter !== undefined) {
        updated = updated.replace(/5\s*\/\/\s*precio.*capítulo/gi, `${config.prices.novelPricePerChapter} // precio por capítulo`);
      }
      return updated;
    }

    return fileContent;
  } catch (error) {
    console.error(`Error injecting config into ${filePath}:`, error);
    return fileContent;
  }
}
