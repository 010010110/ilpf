import { MD3LightTheme } from 'react-native-paper';
import colors from './colors';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    
    // Cores principais do Material Design 3
    primary: colors.primary,
    onPrimary: colors.onPrimary,
    primaryContainer: colors.secondaryLight,
    onPrimaryContainer: colors.primaryDark,
    
    // Cores secundárias
    secondary: colors.secondary,
    onSecondary: colors.onSecondary,
    secondaryContainer: colors.secondaryLight,
    onSecondaryContainer: colors.primaryDark,
    
    // Cores terciárias (tons terrosos)
    tertiary: colors.accent,
    onTertiary: colors.onPrimary,
    tertiaryContainer: colors.accentLight,
    onTertiaryContainer: colors.primaryDark,
    
    // Estados de erro
    error: colors.error,
    onError: colors.onPrimary,
    errorContainer: colors.errorLight,
    onErrorContainer: colors.error,
    
    // Backgrounds e superfícies
    background: colors.background,
    onBackground: colors.onBackground,
    surface: colors.surface,
    onSurface: colors.onSurface,
    surfaceVariant: colors.surfaceVariant,
    onSurfaceVariant: colors.text.secondary,
    
    // Contornos e divisores
    outline: colors.border,
    outlineVariant: colors.borderLight,
    
    // Cores invertidas (para modais e overlays)
    inverseSurface: colors.primaryDark,
    onInverseSurface: colors.onPrimary,
    inversePrimary: colors.primaryLight,
    
    // Sombras e elevações
    shadow: colors.shadow.medium,
    scrim: colors.overlay.dark,
    
    // Estados de superfície com elevação
    elevation: {
      level0: colors.background,    // Sem elevação
      level1: colors.surface,       // Elevação nível 1
      level2: colors.surface,       // Elevação nível 2
      level3: colors.surface,       // Elevação nível 3
      level4: colors.surface,       // Elevação nível 4
      level5: colors.surface,       // Elevação nível 5
    },
  },
  
  // Customizações específicas do app
  roundness: 12, // Bordas mais arredondadas
  
  // Animações
  animation: {
    scale: 1.0,
  },
};

export default theme;

// Tema escuro (para implementação futura)
export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    // Definições para tema escuro serão adicionadas posteriormente
    background: '#121212',
    surface: '#1E1E1E',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
  },
};