import { useEffect, useState } from 'react';
import {
  checkConnectivity,
  subscribeToNetworkChanges,
} from '@/services/networkService';

export function useNetwork() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    checkConnectivity().then(setIsConnected);
    return subscribeToNetworkChanges(setIsConnected);
  }, []);

  return { isConnected };
}