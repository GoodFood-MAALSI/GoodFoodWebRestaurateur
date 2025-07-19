import { useState, useEffect } from 'react';

export function useCurrentUserId() {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.id) {
            setUserId(userData.id);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
    }
    
    setUserId(1);
    setLoading(false);
  }, []);

  return { userId, loading };
}
