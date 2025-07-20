import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useUserStatusCheck() {
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 401) {
          const data = await response.json();
          if (data.suspended) {
            // Clear interval and redirect
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            router.push('/notallowed');
          }
          // Other 401 errors might be token expiration, let middleware handle it
          return;
        }

        if (response.ok) {
          const data = await response.json();
          // User is active, continue normal operation
        }
      } catch (error) {
        // Silently handle errors - don't disrupt user experience
        console.warn('Status check failed:', error);
      }
    };

    // Initial check after 30 seconds
    const initialTimeout = setTimeout(checkUserStatus, 30000);

    // Set up periodic checks
    intervalRef.current = setInterval(checkUserStatus, STATUS_CHECK_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [router]);
}
