import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Layout from './app/_layout'; // Seu componente de navegação

export default function App() {
  return (
    <PaperProvider>
      {/* Envolvendo o aplicativo no Provider do react-native-paper */}
      <Layout />
    </PaperProvider>
  );
}
