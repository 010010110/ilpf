import { MD3LightTheme } from 'react-native-paper';
import colors from './colors';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    

    primary: colors.primary,
    onPrimary: colors.onPrimary,
    primaryContainer: colors.secondaryLight,
    onPrimaryContainer: colors.primaryDark,
    

    secondary: colors.secondary,
    onSecondary: colors.onSecondary,
    secondaryContainer: colors.secondaryLight,
    onSecondaryContainer: colors.primaryDark,
    

    tertiary: colors.accent,
    onTertiary: colors.onPrimary,
    tertiaryContainer: colors.accentLight,
    onTertiaryContainer: colors.primaryDark,
    

    error: colors.error,
    onError: colors.onPrimary,
    errorContainer: colors.errorLight,
    onErrorContainer: colors.error,
    

    background: colors.background,
    onBackground: colors.onBackground,
    surface: colors.surface,
    onSurface: colors.onSurface,
    surfaceVariant: colors.surfaceVariant,
    onSurfaceVariant: colors.text.secondary,
    

    outline: colors.border,
    outlineVariant: colors.borderLight,
    

    inverseSurface: colors.primaryDark,
    onInverseSurface: colors.onPrimary,
    inversePrimary: colors.primaryLight,
    

    shadow: colors.shadow.medium,
    scrim: colors.overlay.dark,
    

    elevation: {
      level0: colors.background,    // Sem elevação
      level1: colors.surface,       // Elevação nível 1
      level2: colors.surface,       // Elevação nível 2
      level3: colors.surface,       // Elevação nível 3
      level4: colors.surface,       // Elevação nível 4
      level5: colors.surface,       // Elevação nível 5
    },
  },
  

  roundness: 12, // Bordas mais arredondadas
  

  animation: {
    scale: 1.0,
  },
};

export default theme;


export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,

    background: '#121212',
    surface: '#1E1E1E',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
  },
};