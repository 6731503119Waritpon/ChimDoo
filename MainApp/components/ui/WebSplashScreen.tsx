import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { AppColors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export const WebSplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/ChimDooLogo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  logo: {
    width: Math.min(width * 0.6, 400),
    height: 300,
  },
});
