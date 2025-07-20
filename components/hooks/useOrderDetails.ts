import { useState } from 'react';
import { DetailedOrder } from '@/types/order';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export function useOrderDetails() {
  const [orderDetails, setOrderDetails] = useState<DetailedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async (orderId: number): Promise<DetailedOrder | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchWithAuth(`/api/proxy/order-details/${orderId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch order details: ${response.status}`);
      }
      
      const data = await response.json();
      const orderDetail = data.data || data;
      
      setOrderDetails(orderDetail);
      return orderDetail;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order details';
      setError(errorMessage);
      setOrderDetails(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearOrderDetails = () => {
    setOrderDetails(null);
    setError(null);
  };

  return {
    orderDetails,
    loading,
    error,
    fetchOrderDetails,
    clearOrderDetails,
  };
}
