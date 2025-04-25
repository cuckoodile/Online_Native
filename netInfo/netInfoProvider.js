import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { updateConnectionStatus } from './netInfoSlice';

const NetInfoProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial check
    NetInfo.fetch().then(state => {
      dispatch(updateConnectionStatus(state));
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(updateConnectionStatus(state));
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return children;
};

export default NetInfoProvider;