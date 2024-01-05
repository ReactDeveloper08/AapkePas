import React from 'react';
import NavContainer from './src/navigation';
import Loader from './src/component/loader';
import {StoreProvider} from './src/context/store';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
export default () => {
  return (
    <StoreProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <NavContainer />
      </SafeAreaProvider>
    </StoreProvider>
  );
};
