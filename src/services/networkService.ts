import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

export async function checkConnectivity(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true && state.isInternetReachable !== false;
}

export function subscribeToNetworkChanges(
  callback: (isConnected: boolean) => void,
): () => void {
  return NetInfo.addEventListener((state: NetInfoState) => {
    const connected =
      state.isConnected === true && state.isInternetReachable !== false;
    callback(connected);
  });
}