import { StyleSheet } from 'react-native';
import colors from '../utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  

  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  

  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  
  infoCard: {
    backgroundColor: colors.surfaceVariant || '#F5F5F5',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 8,
  },
  
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  
  textInput: {
    backgroundColor: colors.background,
    marginBottom: 8,
  },
  
  helperText: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
    marginBottom: 16,
  },
  

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    elevation: 2,
  },
  
  saveButtonContent: {
    paddingVertical: 8,
  },
  
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 64,
  },
  
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  
  settingDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    backgroundColor: colors.errorLight,
    borderRadius: 8,
    marginHorizontal: -4,
  },
  
  actionButtonContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  
  actionButtonDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  infoLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  
  infoValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
  },
  

  divider: {
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  
  footerText: {
    fontSize: 13,
    color: colors.text.secondary,
    marginLeft: 8,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
  

  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  
  buttonPressed: {
    opacity: 0.8,
  },
});

export default styles;