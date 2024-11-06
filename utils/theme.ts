import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ECE5DF',       // Cor de fundo do app
    primary: '#859B48',          // Cor primária para elementos principais
    accent: '#DFC8B6',           // Cor secundária para destaque
    surface: '#C4C7B6',          // Cor para áreas de destaque (como cards)
    text: '#1D361F',             // Cor para texto principal
    onSurface: '#1D361F', // Ajusta o texto para elementos de superfície (cards)
    placeholder: '#859B48',      // Cor para placeholders
  },
};

export default theme;
