import { StyleSheet } from 'react-native';
import colors from '../utils/colors';


export const GlobalStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  
  contentContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  

  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  cardElevated: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  

  cardIncomplete: {
    backgroundColor: colors.incomplete.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.incomplete.border,
    elevation: 2,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  cardComplete: {
    backgroundColor: colors.complete.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.complete.border,
    elevation: 2,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  

  titleLarge: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  
  titleMedium: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 6,
  },
  
  titleSmall: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  
  headlineSmall: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  
  bodyLarge: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
  },
  
  bodyMedium: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  
  labelLarge: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  
  labelMedium: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  
  caption: {
    fontSize: 12,
    color: colors.text.hint,
    lineHeight: 16,
  },
  

  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  buttonSecondary: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  
  buttonOutlined: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonDisabled: {
    backgroundColor: colors.text.disabled,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  

  buttonTextPrimary: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  
  buttonTextSecondary: {
    color: colors.onSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  
  buttonTextOutlined: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  
  buttonTextDisabled: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.6,
  },
  

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 16,
  },
  
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  

  marginSmall: {
    margin: 8,
  },
  
  marginMedium: {
    margin: 16,
  },
  
  marginLarge: {
    margin: 24,
  },
  
  paddingSmall: {
    padding: 8,
  },
  
  paddingMedium: {
    padding: 16,
  },
  
  paddingLarge: {
    padding: 24,
  },
  

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 16,
  },
  

  statusIncomplete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.incomplete.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  statusComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.complete.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  statusTextIncomplete: {
    color: colors.incomplete.text,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  
  statusTextComplete: {
    color: colors.complete.text,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  

  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.text.disabled,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  
  stepCircleComplete: {
    backgroundColor: colors.success,
  },
  
  stepNumber: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.text.disabled,
    marginHorizontal: 4,
  },
  
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  
  stepLineComplete: {
    backgroundColor: colors.success,
  },
});


export const combineStyles = (...styles: any[]) => {
  return StyleSheet.flatten(styles);
};

export default GlobalStyles;