import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, Home, MessageCircle, Calculator, DollarSign, CreditCard, Truck, AlertCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
}

export interface OrderData {
  orderId: string;
  customerInfo: CustomerInfo;
  deliveryZone: any;
  deliveryCost: number;
  items: any[];
  subtotal: number;
  transferFee: number;
  total: number;
  cashTotal?: number;
  transferTotal?: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (orderData: OrderData) => void;
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

export function CheckoutModal({ isOpen, onClose, onCheckout, items, total }: CheckoutModalProps) {
  const adminContext = useAdmin();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    address: ''
  });
  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<any>(null);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Get delivery zones from admin context
  const deliveryZones = adminContext?.state?.deliveryZones || [];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^[+]?[0-9\s\-()]{8,}$/.test(customerInfo.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (deliveryType === 'delivery' && !selectedDeliveryZone) {
      newErrors.deliveryZone = 'Debe seleccionar una zona de entrega';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const deliveryCost = deliveryType === 'delivery' && selectedDeliveryZone ? selectedDeliveryZone.cost : 0;
    const finalTotal = total + deliveryCost;

    const orderData: OrderData = {
      orderId: `TV-${Date.now()}`,
      customerInfo,
      deliveryZone: deliveryType === 'delivery' ? selectedDeliveryZone : { name: 'Recogida en tienda', cost: 0 },
      deliveryCost,
      items,
      subtotal: total,
      transferFee: 0,
      total: finalTotal
    };

    onCheckout(orderData);
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Finalizar Pedido</h2>
                <p className="text-blue-100">Complete sus datos para continuar</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese su nombre completo"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+53 5469 0878"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese su dirección completa"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Opciones de Entrega</h3>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={deliveryType === 'pickup'}
                      onChange={(e) => setDeliveryType(e.target.value as 'pickup' | 'delivery')}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Recogida en tienda (Gratis)</span>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="delivery"
                      checked={deliveryType === 'delivery'}
                      onChange={(e) => setDeliveryType(e.target.value as 'pickup' | 'delivery')}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Entrega a domicilio</span>
                  </label>
                </div>

                {deliveryType === 'delivery' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zona de Entrega *
                    </label>
                    {deliveryZones.length > 0 ? (
                      <select
                        value={selectedDeliveryZone?.id || ''}
                        onChange={(e) => {
                          const zone = deliveryZones.find(z => z.id === parseInt(e.target.value));
                          setSelectedDeliveryZone(zone || null);
                          if (errors.deliveryZone) {
                            setErrors(prev => ({ ...prev, deliveryZone: '' }));
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.deliveryZone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Seleccione una zona</option>
                        {deliveryZones.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name} - ${zone.cost.toLocaleString()} CUP
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                          <p className="text-yellow-800 text-sm">
                            No hay zonas de entrega configuradas. Por favor, seleccione "Recogida en tienda".
                          </p>
                        </div>
                      </div>
                    )}
                    {errors.deliveryZone && (
                      <p className="text-red-500 text-sm mt-1">{errors.deliveryZone}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <Calculator className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Resumen del Pedido</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({items.length} elementos)</span>
                  <span className="font-semibold">${total.toLocaleString()} CUP</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Costo de entrega</span>
                  <span className="font-semibold">
                    {deliveryType === 'delivery' && selectedDeliveryZone 
                      ? `$${selectedDeliveryZone.cost.toLocaleString()} CUP`
                      : 'Gratis'
                    }
                  </span>
                </div>
                
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Final</span>
                    <span className="text-xl font-bold text-green-600">
                      ${(total + (deliveryType === 'delivery' && selectedDeliveryZone ? selectedDeliveryZone.cost : 0)).toLocaleString()} CUP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center transform hover:scale-105"
            >
              <MessageCircle className="mr-3 h-6 w-6" />
              Enviar Pedido por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}