import { StyleSheet } from 'react-native';
import colors from '../utils/colors';

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    elevation: 3,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderBottomWidth: 0, // Remove borda padrão do Appbar
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 64,
  },
  

  backButton: {
    marginRight: 8,
    padding: 4,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  

  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  titleIcon: {
    marginRight: 12,
  },
  
  titleTextContainer: {
    flex: 1,
  },
  
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
    lineHeight: 18,
  },
  

  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  
  actionButton: {
    padding: 8,
    marginLeft: 4,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  
  actionButtonDisabled: {
    opacity: 0.4,
  },
  

  headerPrimary: {
    backgroundColor: colors.primary,
  },
  
  headerSecondary: {
    backgroundColor: colors.secondary,
  },
  
  headerDark: {
    backgroundColor: colors.primaryDark,
  },
  
  headerLight: {
    backgroundColor: colors.background,
  },
  

  buttonPressed: {
    backgroundColor: colors.primaryLight,
    opacity: 0.8,
  },
  

  titleCompact: {
    fontSize: 20,
  },
  
  subtitleCompact: {
    fontSize: 13,
  },
});

export default styles;