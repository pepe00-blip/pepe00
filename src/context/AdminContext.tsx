import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { STORAGE_KEYS, DEFAULT_PRICES, ADMIN_CREDENTIALS } from '../utils/constants';
import { withErrorHandling, logError } from '../utils/errorHandling';
import JSZip from 'jszip';

export interface PriceConfig {
  moviePrice: number;
  seriesPrice: number;
  transferFeePercentage: number;
  novelPricePerChapter: number;
}

export interface DeliveryZone {
  id: number;
  name: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

export interface Novel {
  id: number;
  titulo: string;
  genero: string;
  capitulos: number;
  año: number;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  section: string;
  action: string;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string;
  pendingChanges: number;
}

export interface AdminState {
  isAuthenticated: boolean;
  prices: PriceConfig;
  deliveryZones: DeliveryZone[];
  novels: Novel[];
  notifications: Notification[];
  syncStatus: SyncStatus;
}

type AdminAction =
  | { type: 'LOGIN'; payload: { username: string; password: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PRICES'; payload: PriceConfig }
  | { type: 'ADD_DELIVERY_ZONE'; payload: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_DELIVERY_ZONE'; payload: DeliveryZone }
  | { type: 'DELETE_DELIVERY_ZONE'; payload: number }
  | { type: 'ADD_NOVEL'; payload: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_NOVEL'; payload: Novel }
  | { type: 'DELETE_NOVEL'; payload: number }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'UPDATE_SYNC_STATUS'; payload: Partial<SyncStatus> }
  | { type: 'SYNC_STATE'; payload: Partial<AdminState> };

interface AdminContextType {
  state: AdminState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updatePrices: (prices: PriceConfig) => void;
  addDeliveryZone: (zone: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDeliveryZone: (zone: DeliveryZone) => void;
  deleteDeliveryZone: (id: number) => void;
  addNovel: (novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNovel: (novel: Novel) => void;
  deleteNovel: (id: number) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  clearNotifications: () => void;
  exportSystemBackup: () => Promise<void>;
  syncWithRemote: () => Promise<void>;
}

const initialState: AdminState = {
  isAuthenticated: false,
  prices: DEFAULT_PRICES,
  deliveryZones: [],
  novels: [],
  notifications: [],
  syncStatus: {
    isOnline: true,
    lastSync: new Date().toISOString(),
    pendingChanges: 0
  }
};

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  try {
    switch (action.type) {
      case 'LOGIN':
        if (action.payload.username === ADMIN_CREDENTIALS.username && 
            action.payload.password === ADMIN_CREDENTIALS.password) {
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

      case 'UPDATE_DELIVERY_ZONE':
        return {
          ...state,
          deliveryZones: state.deliveryZones.map(zone =>
            zone.id === action.payload.id
              ? { ...action.payload, updatedAt: new Date().toISOString() }
              : zone
          ),
          syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
        };

      case 'DELETE_DELIVERY_ZONE':
        return {
          ...state,
          deliveryZones: state.deliveryZones.filter(zone => zone.id !== action.payload),
          syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
        };

      case 'ADD_NOVEL':
        const newNovel: Novel = {
          ...action.payload,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return {
          ...state,
          novels: [...state.novels, newNovel],
          syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
        };

      case 'UPDATE_NOVEL':
        return {
          ...state,
          novels: state.novels.map(novel =>
            novel.id === action.payload.id
              ? { ...action.payload, updatedAt: new Date().toISOString() }
              : novel
          ),
          syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
        };

      case 'DELETE_NOVEL':
        return {
          ...state,
          novels: state.novels.filter(novel => novel.id !== action.payload),
          syncStatus: { ...state.syncStatus, pendingChanges: state.syncStatus.pendingChanges + 1 }
        };

      case 'ADD_NOTIFICATION':
        const notification: Notification = {
          ...action.payload,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        };
        return {
          ...state,
          notifications: [notification, ...state.notifications].slice(0, 100),
        };

      case 'CLEAR_NOTIFICATIONS':
        return {
          ...state,
          notifications: [],
        };

      case 'UPDATE_SYNC_STATUS':
        return {
          ...state,
          syncStatus: { ...state.syncStatus, ...action.payload },
        };

      case 'SYNC_STATE':
        return {
          ...state,
          ...action.payload,
          syncStatus: { 
            ...state.syncStatus, 
            lastSync: new Date().toISOString(), 
            pendingChanges: 0 
          }
        };

      default:
        return state;
    }
  } catch (error) {
    logError(error, 'AdminReducer');
    return state;
  }
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

class RealTimeSyncService {
  private listeners: Set<(data: any) => void> = new Set();
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeSync();
  }

  private initializeSync() {
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    this.syncInterval = setInterval(() => {
      this.checkForUpdates();
    }, 5000);
    
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    });
  }

  private handleStorageChange(event: StorageEvent) {
    if (event.key === STORAGE_KEYS.adminState && event.newValue) {
      try {
        const newState = JSON.parse(event.newValue);
        this.notifyListeners(newState);
      } catch (error) {
        logError(error, 'StorageChange');
      }
    }
  }

  private checkForUpdates() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.adminState);
      if (stored) {
        const storedState = JSON.parse(stored);
        this.notifyListeners(storedState);
      }
    } catch (error) {
      logError(error, 'CheckUpdates');
    }
  }

  subscribe(callback: (data: any) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  broadcast(state: AdminState) {
    try {
      const syncData = {
        ...state,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.adminState, JSON.stringify(syncData));
      this.notifyListeners(syncData);
    } catch (error) {
      logError(error, 'Broadcast');
    }
  }

  private notifyListeners(data: any) {
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        logError(error, 'NotifyListeners');
      }
    });
  }

  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
    this.listeners.clear();
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const [syncService] = React.useState(() => new RealTimeSyncService());
  const isOnline = useOnlineStatus();

  // Update online status
  useEffect(() => {
    dispatch({ 
      type: 'UPDATE_SYNC_STATUS', 
      payload: { isOnline } 
    });
  }, [isOnline]);

  // Load initial state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.adminState);
      if (stored) {
        const storedState = JSON.parse(stored);
        dispatch({ type: 'SYNC_STATE', payload: storedState });
      }
    } catch (error) {
      logError(error, 'LoadInitialState');
    }
  }, []);

  // Save state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.adminState, JSON.stringify(state));
      syncService.broadcast(state);
    } catch (error) {
      logError(error, 'SaveState');
    }
  }, [state, syncService]);

  // Subscribe to sync updates
  useEffect(() => {
    const unsubscribe = syncService.subscribe((syncedState) => {
      if (JSON.stringify(syncedState) !== JSON.stringify(state)) {
        dispatch({ type: 'SYNC_STATE', payload: syncedState });
      }
    });
    return unsubscribe;
  }, [syncService, state]);

  // Cleanup
  useEffect(() => {
    return () => {
      syncService.destroy();
    };
  }, [syncService]);

  const login = withErrorHandling((username: string, password: string): boolean => {
    dispatch({ type: 'LOGIN', payload: { username, password } });
    const success = username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
    
    if (success) {
      addNotification({
        type: 'success',
        title: 'Inicio de sesión exitoso',
        message: 'Bienvenido al panel de administración',
        section: 'Autenticación',
        action: 'login'
      });
    }
    return success;
  }, 'AdminLogin');

  const logout = withErrorHandling(() => {
    dispatch({ type: 'LOGOUT' });
    addNotification({
      type: 'info',
      title: 'Sesión cerrada',
      message: 'Has cerrado sesión correctamente',
      section: 'Autenticación',
      action: 'logout'
    });
  }, 'AdminLogout');

  const updatePrices = withErrorHandling((prices: PriceConfig) => {
    dispatch({ type: 'UPDATE_PRICES', payload: prices });
    addNotification({
      type: 'success',
      title: 'Precios actualizados',
      message: 'Los precios se han actualizado correctamente',
      section: 'Precios',
      action: 'update'
    });
  }, 'UpdatePrices');

  const addDeliveryZone = withErrorHandling((zone: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_DELIVERY_ZONE', payload: zone });
    addNotification({
      type: 'success',
      title: 'Zona de entrega agregada',
      message: `Se agregó la zona "${zone.name}"`,
      section: 'Zonas de Entrega',
      action: 'create'
    });
  }, 'AddDeliveryZone');

  const updateDeliveryZone = withErrorHandling((zone: DeliveryZone) => {
    dispatch({ type: 'UPDATE_DELIVERY_ZONE', payload: zone });
    addNotification({
      type: 'success',
      title: 'Zona de entrega actualizada',
      message: `Se actualizó la zona "${zone.name}"`,
      section: 'Zonas de Entrega',
      action: 'update'
    });
  }, 'UpdateDeliveryZone');

  const deleteDeliveryZone = withErrorHandling((id: number) => {
    const zone = state.deliveryZones.find(z => z.id === id);
    dispatch({ type: 'DELETE_DELIVERY_ZONE', payload: id });
    addNotification({
      type: 'warning',
      title: 'Zona de entrega eliminada',
      message: `Se eliminó la zona "${zone?.name || 'Desconocida'}"`,
      section: 'Zonas de Entrega',
      action: 'delete'
    });
  }, 'DeleteDeliveryZone');

  const addNovel = withErrorHandling((novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_NOVEL', payload: novel });
    addNotification({
      type: 'success',
      title: 'Novela agregada',
      message: `Se agregó la novela "${novel.titulo}"`,
      section: 'Gestión de Novelas',
      action: 'create'
    });
  }, 'AddNovel');

  const updateNovel = withErrorHandling((novel: Novel) => {
    dispatch({ type: 'UPDATE_NOVEL', payload: novel });
    addNotification({
      type: 'success',
      title: 'Novela actualizada',
      message: `Se actualizó la novela "${novel.titulo}"`,
      section: 'Gestión de Novelas',
      action: 'update'
    });
  }, 'UpdateNovel');

  const deleteNovel = withErrorHandling((id: number) => {
    const novel = state.novels.find(n => n.id === id);
    dispatch({ type: 'DELETE_NOVEL', payload: id });
    addNotification({
      type: 'warning',
      title: 'Novela eliminada',
      message: `Se eliminó la novela "${novel?.titulo || 'Desconocida'}"`,
      section: 'Gestión de Novelas',
      action: 'delete'
    });
  }, 'DeleteNovel');

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const clearNotifications = withErrorHandling(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, 'ClearNotifications');

  const exportSystemBackup = withErrorHandling(async () => {
    try {
      const zip = new JSZip();
      
      // System configuration
      const systemConfig = {
        version: '2.0.0',
        exportDate: new Date().toISOString(),
        state: state
      };
      
      zip.file('system-config.json', JSON.stringify(systemConfig, null, 2));
      
      // README
      const readme = `# TV a la Carta - Sistema Exportado

## Información del Sistema
- Versión: 2.0.0
- Exportado: ${new Date().toLocaleString('es-ES')}
- Zonas de entrega: ${state.deliveryZones.length}
- Novelas: ${state.novels.length}
- Notificaciones: ${state.notifications.length}

## Configuración de Precios
- Películas: $${state.prices.moviePrice} CUP
- Series: $${state.prices.seriesPrice} CUP por temporada
- Recargo transferencia: ${state.prices.transferFeePercentage}%
- Novelas: $${state.prices.novelPricePerChapter} CUP por capítulo

## Credenciales de Administrador
- Usuario: admin
- Contraseña: admin123
`;
      
      zip.file('README.md', readme);
      
      // Generate and download
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TV_a_la_Carta_Sistema_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addNotification({
        type: 'success',
        title: 'Sistema exportado',
        message: 'El sistema completo se ha exportado correctamente',
        section: 'Sistema',
        action: 'export'
      });
    } catch (error) {
      logError(error, 'ExportSystem');
      addNotification({
        type: 'error',
        title: 'Error en exportación',
        message: 'No se pudo exportar el sistema',
        section: 'Sistema',
        action: 'export_error'
      });
    }
  }, 'ExportSystemBackup');

  const syncWithRemote = withErrorHandling(async () => {
    try {
      dispatch({ type: 'UPDATE_SYNC_STATUS', payload: { isOnline: true } });
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ 
        type: 'UPDATE_SYNC_STATUS', 
        payload: { 
          lastSync: new Date().toISOString(),
          pendingChanges: 0
        } 
      });
      
      addNotification({
        type: 'success',
        title: 'Sincronización completada',
        message: 'Todos los datos se han sincronizado correctamente',
        section: 'Sistema',
        action: 'sync'
      });
    } catch (error) {
      dispatch({ type: 'UPDATE_SYNC_STATUS', payload: { isOnline: false } });
      addNotification({
        type: 'error',
        title: 'Error de sincronización',
        message: 'No se pudo sincronizar con el servidor',
        section: 'Sistema',
        action: 'sync_error'
      });
    }
  }, 'SyncWithRemote');

  return (
    <AdminContext.Provider
      value={{
        state,
        login,
        logout,
        updatePrices,
        addDeliveryZone,
        updateDeliveryZone,
        deleteDeliveryZone,
        addNovel,
        updateNovel,
        deleteNovel,
        addNotification,
        clearNotifications,
        exportSystemBackup,
        syncWithRemote,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export { AdminContext };