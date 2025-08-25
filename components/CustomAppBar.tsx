import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/utils/types';
import colors from '@/utils/colors';

const CustomAppBar = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Appbar.Header style={{ backgroundColor: colors.text }}>
      {/* Logotipo alinhado à esquerda */}
      {/* <Image
        source={require('../assets/images/ilpf_.png')}
        style={{ width: 120, height: 40 }}
        resizeMode="contain"
      /> */}
      <Appbar.Content title="ILPF"  titleStyle={{ color: colors.primary }}/>
      {/* Menu suspenso à direita */}
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="menu" color="white" onPress={openMenu} />
          }
        >
          <Menu.Item onPress={() => { closeMenu(); navigation.navigate('Form'); }} title="Entrada de Dados" />
          <Menu.Item onPress={() => { closeMenu(); navigation.navigate('List'); }} title="Visualizar Dados" />
          <Menu.Item onPress={() => { closeMenu(); navigation.navigate('Settings'); }} title="Configurações" />
          <Menu.Item onPress={() => { closeMenu(); navigation.navigate('About'); }} title="Sobre o app" />
        </Menu>
      </View>
    </Appbar.Header>
  );
};

export default CustomAppBar;
