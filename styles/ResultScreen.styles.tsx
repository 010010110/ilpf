import { StyleSheet } from 'react-native';
import colors from '../utils/colors';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
  },
  
  header: {
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  
  headerIcon: {
    marginRight: 12,
  },
  

  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  
  resultCardHighlight: {
    backgroundColor: colors.secondaryLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    elevation: 3,
  },
  

  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    minHeight: 40,
  },
  
  resultRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: 8,
    paddingBottom: 12,
  },
  
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  
  noDataIconContainer: {
    marginBottom: 16,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  

  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    elevation: 2,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  actionButtonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    elevation: 1,
  },
  
  badge: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  
  dividerContainer: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 16,
  },
  
  measurementHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
});


export const textStyles = StyleSheet.create({

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    marginTop: 24,
  },
  
  sectionTitleFirst: {
    marginTop: 8,
  },
  
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
    lineHeight: 22,
  },
  
  labelSmall: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'right',
    lineHeight: 22,
  },
  
  valueHighlight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'right',
    lineHeight: 24,
  },
  
  valueLarge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'right',
    lineHeight: 26,
  },
  
  unit: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  
  noDataText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 16,
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  actionButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  
  actionButtonSecondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  measurementName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },
  
  measurementDate: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default styles;