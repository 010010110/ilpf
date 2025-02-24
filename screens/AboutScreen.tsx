import React from 'react';
import { Text, ScrollView } from 'react-native';
import styles from '@/styles/About.styles';

const AboutScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sobre o Aplicativo</Text>
      <Text style={styles.text}>
        Este aplicativo foi desenvolvido com o objetivo de fornecer uma solução prática e eficiente para Integração lavoura pecuaria e floresta.
      </Text>
      
      <Text style={styles.subtitle}>Desenvolvido por:</Text>
      <Text style={styles.text}>
        Gabriel Carneiro de Arruda
      </Text>

      <Text style={styles.subtitle}>Orientado por:</Text>
      <Text style={styles.text}>
        Alaine Margarete Guimarães
      </Text>

      <Text style={styles.subtitle}>Instituição:</Text>
      <Text style={styles.text}>
        UEPG
      </Text>
      <Text style={styles.text}>
        EMBRAPA
      </Text>
    </ScrollView>
  );
};

export default AboutScreen;