import React from 'react';
import { View, ActivityIndicator, Text, Image } from 'react-native';
import style from '../styles/LoadingScreen.styles';
import colors from '@/utils/colors';

const LoadingScreen = () => {
  return (
    <View style={style.container}>
      <Image source={require('../assets/images/icon.png')} style={style.mainLogo} />
      <ActivityIndicator size="large" color={colors.placeholder} style={style.activityIndicator} />
      <Text style={style.text}>Integração Lavoura-Pecuária-Floresta</Text>
      <View style={style.logoContainer}>
        <Image source={require('../assets/images/uepg_.png')} style={style.logo} />
        <Image source={require('../assets/images/embrapa_.png')} style={style.logo} />
      </View>
    </View>
  );
};

export default LoadingScreen;
