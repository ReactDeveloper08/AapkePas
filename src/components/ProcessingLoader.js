import React from 'react';
import {ImageBackground} from 'react-native';
import {StyleSheet, ActivityIndicator} from 'react-native';

const ProcessingLoader = () => (
  <ImageBackground
    style={styles.modalContainer}
    // source={voiceCallBg}
    blurRadius={3}>
    <ActivityIndicator size="large" color="#ffffff" animating={true} />
  </ImageBackground>
);

export default ProcessingLoader;

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
