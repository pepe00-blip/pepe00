import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Settings, DollarSign, MapPin, BookOpen, Bell, Download, Upload, FolderSync as Sync, LogOut, Eye, EyeOff, Save, Plus, Edit, Trash2, Check, X, AlertCircle, Info, RefreshCw, Code, FileText, Database, Zap, Shield, Activity, Clock, Users, TrendingUp, BarChart3, Calendar, Smartphone, Monitor, Wifi, WifiOff, CheckCircle, XCircle, AlertTriangle, MessageSquare } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      onLogin(username, password);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
          <div className="bg-white/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Shield className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-blue-100">TV a la Carta</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ingrese su usuario"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  placeholder="Ingrese su contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Credenciales de acceso</span>
            </div>
            <div className="text-xs text-blue-600 space-y-1">
              <p>Usuario: <code className="bg-blue-100 px-2 py-1 rounded">admin</code></p>
              <p>Contraseña: <code className="bg-blue-100 px-2 py-1 rounded">admin123</code></p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminPanel() {
  const { 
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
    clearNotifications,
    exportSystemConfig,
    exportCompleteSourceCode,
    syncWithRemote,
    syncAllSections
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'prices' | 'zones' | 'novels' | 'notifications' | 'system'>('dashboard');
  const [editingPrices, setEditingPrices] = useState(false);
  const [tempPrices, setTempPrices] = useState(state.prices);
  const [editingZone, setEditingZone] = useState<number | null>(null);
  const [newZone, setNewZone] = useState({ name: '', cost: 0 });
  const [editingNovel, setEditingNovel] = useState<number | null>(null);
  const [newNovel, setNewNovel] = useState({ titulo: '', genero: '', capitulos: 0, año: new Date().getFullYear(), descripcion: '' });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingSource, setIsExportingSource] = useState(false);

  // Update temp prices when state changes
  useEffect(() => {
    setTempPrices(state.prices);
  }, [state.prices]);

  if (!state.isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  const handlePriceUpdate = () => {
    updatePrices(tempPrices);
    setEditingPrices(false);
  };

  const handleAddZone = () => {
    if (newZone.name.trim() && newZone.cost >= 0) {
      addDeliveryZone(newZone);
      setNewZone({ name: '', cost: 0 });
    }
  };

  const handleUpdateZone = (zone: any) => {
    updateDeliveryZone(zone);
    setEditingZone(null);
  };

  const handleAddNovel = () => {
    if (newNovel.titulo.trim() && newNovel.genero.trim() && newNovel.capitulos > 0) {
      addNovel(newNovel);
      setNewNovel({ titulo: '', genero: '', capitulos: 0, año: new Date().getFullYear(), descripcion: '' });
    }
  };

  const handleUpdateNovel = (novel: any) => {
    updateNovel(novel);
    setEditingNovel(null);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncWithRemote();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFullSync = async () => {
    setIsSyncing(true);
    try {
      await syncAllSections();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportConfig = async () => {
    setIsExporting(true);
    try {
      await exportSystemConfig();
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSourceCode = async () => {
    setIsExportingSource(true);
    try {
      await exportCompleteSourceCode();
    } finally {
      setIsExportingSource(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'prices', label: 'Precios', icon: DollarSign },
    { id: 'zones', label: 'Zonas de Entrega', icon: MapPin },
    { id: 'novels', label: 'Gestión de Novelas', icon: BookOpen },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'system', label: 'Sistema', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Panel de Administración</h1>
                <p className="text-sm opacity-90">TV a la Carta</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                {state.syncStatus.isOnline ? (
                  <Wifi className="h-4 w-4 text-green-300 mr-2" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-300 mr-2" />
                )}
                <span className="text-sm">
                  {state.syncStatus.isOnline ? 'En línea' : 'Sin conexión'}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                  {tab.id === 'notifications' && state.notifications.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {state.notifications.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Activity className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Estado del Sistema</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Estado de Conexión</span>
                    {state.syncStatus.isOnline ? (
                      <Wifi className="h-5 w-5 text-green-500" />
                    ) : (
                      <WifiOff className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {state.syncStatus.isOnline ? 'En Línea' : 'Sin Conexión'}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Última sincronización: {new Date(state.syncStatus.lastSync).toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Cambios Pendientes</span>
                    <RefreshCw className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-green-900">{state.syncStatus.pendingChanges}</p>
                  <p className="text-xs text-green-600 mt-1">Cambios sin sincronizar</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">Notificaciones</span>
                    <Bell className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-lg font-bold text-purple-900">{state.notifications.length}</p>
                  <p className="text-xs text-purple-600 mt-1">Notificaciones activas</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-700">Versión del Sistema</span>
                    <Code className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-lg font-bold text-orange-900">{state.systemConfig.version}</p>
                  <p className="text-xs text-orange-600 mt-1">Versión actual</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <BarChart3 className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Estadísticas Rápidas</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{state.deliveryZones.length}</p>
                  <p className="text-sm text-gray-600">Zonas de Entrega</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{state.novels.length}</p>
                  <p className="text-sm text-gray-600">Novelas Administradas</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">${state.prices.moviePrice}</p>
                  <p className="text-sm text-gray-600">Precio Películas (CUP)</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Zap className="h-6 w-6 text-yellow-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Acciones Rápidas</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white p-4 rounded-xl font-medium transition-all flex items-center justify-center"
                >
                  <Sync className={`h-5 w-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                </button>
                
                <button
                  onClick={handleFullSync}
                  disabled={isSyncing}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white p-4 rounded-xl font-medium transition-all flex items-center justify-center"
                >
                  <RefreshCw className={`h-5 w-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Sincronizando...' : 'Sync Completo'}
                </button>
                
                <button
                  onClick={handleExportConfig}
                  disabled={isExporting}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white p-4 rounded-xl font-medium transition-all flex items-center justify-center"
                >
                  <Download className={`h-5 w-5 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
                  {isExporting ? 'Exportando...' : 'Exportar Config'}
                </button>
                
                <button
                  onClick={clearNotifications}
                  className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl font-medium transition-all flex items-center justify-center"
                >
                  <Bell className="h-5 w-5 mr-2" />
                  Limpiar Notif.
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prices Tab */}
        {activeTab === 'prices' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Gestión de Precios</h2>
              </div>
              
              {!editingPrices ? (
                <button
                  onClick={() => setEditingPrices(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Precios
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handlePriceUpdate}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setEditingPrices(false);
                      setTempPrices(state.prices);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de Películas (CUP)
                  </label>
                  <input
                    type="number"
                    value={tempPrices.moviePrice}
                    onChange={(e) => setTempPrices(prev => ({ ...prev, moviePrice: parseInt(e.target.value) || 0 }))}
                    disabled={!editingPrices}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de Series por Temporada (CUP)
                  </label>
                  <input
                    type="number"
                    value={tempPrices.seriesPrice}
                    onChange={(e) => setTempPrices(prev => ({ ...prev, seriesPrice: parseInt(e.target.value) || 0 }))}
                    disabled={!editingPrices}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recargo por Transferencia (%)
                  </label>
                  <input
                    type="number"
                    value={tempPrices.transferFeePercentage}
                    onChange={(e) => setTempPrices(prev => ({ ...prev, transferFeePercentage: parseInt(e.target.value) || 0 }))}
                    disabled={!editingPrices}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de Novelas por Capítulo (CUP)
                  </label>
                  <input
                    type="number"
                    value={tempPrices.novelPricePerChapter}
                    onChange={(e) => setTempPrices(prev => ({ ...prev, novelPricePerChapter: parseInt(e.target.value) || 0 }))}
                    disabled={!editingPrices}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
            
            {editingPrices && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">
                    Los cambios se aplicarán inmediatamente en toda la aplicación
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delivery Zones Tab */}
        {activeTab === 'zones' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Zonas de Entrega</h2>
            </div>
            
            {/* Add New Zone */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4">Agregar Nueva Zona</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nombre de la zona"
                  value={newZone.name}
                  onChange={(e) => setNewZone(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Costo de entrega"
                  value={newZone.cost}
                  onChange={(e) => setNewZone(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddZone}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </button>
              </div>
            </div>
            
            {/* Zones List */}
            <div className="space-y-3">
              {state.deliveryZones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {editingZone === zone.id ? (
                    <div className="flex items-center space-x-4 flex-1">
                      <input
                        type="text"
                        value={zone.name}
                        onChange={(e) => handleUpdateZone({ ...zone, name: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        value={zone.cost}
                        onChange={(e) => handleUpdateZone({ ...zone, cost: parseInt(e.target.value) || 0 })}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingZone(null)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingZone(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{zone.name}</p>
                        <p className="text-sm text-gray-600">${zone.cost} CUP</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingZone(zone.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteDeliveryZone(zone.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Novels Tab */}
        {activeTab === 'novels' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <BookOpen className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Gestión de Novelas</h2>
            </div>
            
            {/* Add New Novel */}
            <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-4">Agregar Nueva Novela</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Título de la novela"
                  value={newNovel.titulo}
                  onChange={(e) => setNewNovel(prev => ({ ...prev, titulo: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Género"
                  value={newNovel.genero}
                  onChange={(e) => setNewNovel(prev => ({ ...prev, genero: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  placeholder="Capítulos"
                  value={newNovel.capitulos}
                  onChange={(e) => setNewNovel(prev => ({ ...prev, capitulos: parseInt(e.target.value) || 0 }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  placeholder="Año"
                  value={newNovel.año}
                  onChange={(e) => setNewNovel(prev => ({ ...prev, año: parseInt(e.target.value) || new Date().getFullYear() }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleAddNovel}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </button>
              </div>
              <textarea
                placeholder="Descripción (opcional)"
                value={newNovel.descripcion}
                onChange={(e) => setNewNovel(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={2}
              />
            </div>
            
            {/* Novels List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {state.novels.map((novel) => (
                <div key={novel.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {editingNovel === novel.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                          type="text"
                          value={novel.titulo}
                          onChange={(e) => handleUpdateNovel({ ...novel, titulo: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="text"
                          value={novel.genero}
                          onChange={(e) => handleUpdateNovel({ ...novel, genero: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="number"
                          value={novel.capitulos}
                          onChange={(e) => handleUpdateNovel({ ...novel, capitulos: parseInt(e.target.value) || 0 })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="number"
                          value={novel.año}
                          onChange={(e) => handleUpdateNovel({ ...novel, año: parseInt(e.target.value) || 0 })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <textarea
                        value={novel.descripcion || ''}
                        onChange={(e) => handleUpdateNovel({ ...novel, descripcion: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={2}
                        placeholder="Descripción (opcional)"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingNovel(null)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingNovel(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{novel.titulo}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            {novel.genero}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            {novel.capitulos} capítulos
                          </span>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                            {novel.año}
                          </span>
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                            ${(novel.capitulos * state.prices.novelPricePerChapter).toLocaleString()} CUP
                          </span>
                        </div>
                        {novel.descripcion && (
                          <p className="text-sm text-gray-600 mt-2">{novel.descripcion}</p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setEditingNovel(novel.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteNovel(novel.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Bell className="h-6 w-6 text-yellow-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">
                  Notificaciones ({state.notifications.length})
                </h2>
              </div>
              
              {state.notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar Todas
                </button>
              )}
            </div>
            
            {state.notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay notificaciones</h3>
                <p className="text-gray-600">Las notificaciones del sistema aparecerán aquí</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {state.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      notification.type === 'success' ? 'bg-green-50 border-green-400' :
                      notification.type === 'error' ? 'bg-red-50 border-red-400' :
                      notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                      'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Sección: {notification.section}</span>
                          <span>Acción: {notification.action}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-8">
            {/* System Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Monitor className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Información del Sistema</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <div className="flex items-center mb-2">
                    <Code className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="font-medium text-indigo-900">Versión</span>
                  </div>
                  <p className="text-lg font-bold text-indigo-800">{state.systemConfig.version}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-900">Última Exportación</span>
                  </div>
                  <p className="text-sm font-medium text-green-800">
                    {new Date(state.systemConfig.lastExport).toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">Tiempo Activo</span>
                  </div>
                  <p className="text-sm font-medium text-blue-800">
                    {new Date(state.systemConfig.metadata.systemUptime).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Export/Import Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Database className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Exportación e Importación</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Configuration */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <Download className="h-6 w-6 text-green-600 mr-3" />
                    <h3 className="text-lg font-bold text-green-900">Exportar Configuración</h3>
                  </div>
                  <p className="text-sm text-green-700 mb-4">
                    Exporta la configuración actual del sistema como archivo JSON
                  </p>
                  <ul className="text-xs text-green-600 mb-4 space-y-1">
                    <li>• Precios actuales</li>
                    <li>• Zonas de entrega</li>
                    <li>• Catálogo de novelas</li>
                    <li>• Configuración del sistema</li>
                  </ul>
                  <button
                    onClick={handleExportConfig}
                    disabled={isExporting}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center"
                  >
                    <Download className={`h-5 w-5 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
                    {isExporting ? 'Exportando...' : 'Exportar Configuración JSON'}
                  </button>
                </div>

                {/* Export Complete Source Code */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <Code className="h-6 w-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-bold text-blue-900">Exportar Sistema Completo</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    Exportar Sistema Completo (Código Fuente)
                  </p>
                  <ul className="text-xs text-blue-600 mb-4 space-y-1">
                    <li>• Configuración embebida: Toda la configuración se embebe directamente en el código fuente</li>
                    <li>• Sin localStorage: El sistema funciona completamente desde archivos de código</li>
                    <li>• Archivos generados:</li>
                    <li className="ml-4">- AdminContext.tsx con configuración embebida</li>
                    <li className="ml-4">- CartContext.tsx con precios embebidos</li>
                    <li className="ml-4">- CheckoutModal.tsx con zonas embebidas</li>
                    <li className="ml-4">- PriceCard.tsx con precios embebidos</li>
                    <li className="ml-4">- NovelasModal.tsx con catálogo embebido</li>
                    <li className="ml-4">- system-config.json como respaldo</li>
                    <li className="ml-4">- README-SISTEMA-COMPLETO.md con instrucciones</li>
                  </ul>
                  <button
                    onClick={handleExportSourceCode}
                    disabled={isExportingSource}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center"
                  >
                    <Code className={`h-5 w-5 mr-2 ${isExportingSource ? 'animate-spin' : ''}`} />
                    {isExportingSource ? 'Generando Sistema...' : 'Exportar Sistema Completo'}
                  </button>
                </div>
              </div>
            </div>

            {/* Sync Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Sync className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Sincronización</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center mb-4">
                    <RefreshCw className="h-6 w-6 text-purple-600 mr-3" />
                    <h3 className="text-lg font-bold text-purple-900">Sincronización Básica</h3>
                  </div>
                  <p className="text-sm text-purple-700 mb-4">
                    Sincroniza los datos básicos del sistema
                  </p>
                  <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center"
                  >
                    <Sync className={`h-5 w-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
                  </button>
                </div>
                
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center mb-4">
                    <Zap className="h-6 w-6 text-orange-600 mr-3" />
                    <h3 className="text-lg font-bold text-orange-900">Sincronización Completa</h3>
                  </div>
                  <p className="text-sm text-orange-700 mb-4">
                    Sincroniza todas las secciones del sistema
                  </p>
                  <button
                    onClick={handleFullSync}
                    disabled={isSyncing}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center"
                  >
                    <RefreshCw className={`h-5 w-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Sincronizando...' : 'Sincronización Completa'}
                  </button>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Estado de Sincronización</p>
                    <p className="text-sm text-gray-600">
                      Última sincronización: {new Date(state.syncStatus.lastSync).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {state.syncStatus.isOnline ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Conectado</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Desconectado</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <Settings className="h-6 w-6 text-gray-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Configuración del Sistema</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Sincronización Automática</p>
                      <p className="text-sm text-gray-600">Sincronizar cambios automáticamente</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      state.systemConfig.settings.autoSync ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        state.systemConfig.settings.autoSync ? 'translate-x-6' : 'translate-x-0.5'
                      } mt-0.5`} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Notificaciones</p>
                      <p className="text-sm text-gray-600">Mostrar notificaciones del sistema</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      state.systemConfig.settings.enableNotifications ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        state.systemConfig.settings.enableNotifications ? 'translate-x-6' : 'translate-x-0.5'
                      } mt-0.5`} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">Intervalo de Sincronización</p>
                    <p className="text-sm text-gray-600 mb-2">
                      {Math.round(state.systemConfig.settings.syncInterval / 60000)} minutos
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min((state.systemConfig.settings.syncInterval / 600000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">Máximo de Notificaciones</p>
                    <p className="text-sm text-gray-600">
                      {state.systemConfig.settings.maxNotifications} notificaciones
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Metadata */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Metadatos del Sistema</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{state.systemConfig.metadata.totalOrders}</p>
                  <p className="text-sm text-gray-600">Órdenes Totales</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${state.systemConfig.metadata.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Ingresos Totales (CUP)</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {state.systemConfig.metadata.lastOrderDate 
                      ? new Date(state.systemConfig.metadata.lastOrderDate).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                  <p className="text-sm text-gray-600">Última Orden</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Activity className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.round((Date.now() - new Date(state.systemConfig.metadata.systemUptime).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-sm text-gray-600">Días Activo</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}