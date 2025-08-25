import { StyleSheet } from 'react-native';
import colors from '../utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header
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
    color: colors.text.primary, // Usando nossa paleta
    letterSpacing: 0.5,
  },
  
  // Scroll Container
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  
  // App Card
  appCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.secondaryLight, // Usando cor da nossa paleta
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  appInfo: {
    flex: 1,
  },
  
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  
  appSubtitle: {
    fontSize: 14,
    color: colors.text.secondary, // Usando nossa paleta
    marginBottom: 8,
    lineHeight: 20,
  },
  
  versionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondaryLight, // Usando nossa paleta
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary, // Usando nossa paleta
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  appDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary, // Usando nossa paleta
    textAlign: 'justify',
  },
  
  // Features Card
  featuresCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  featuresList: {
    gap: 12,
  },
  
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  featureText: {
    fontSize: 15,
    color: colors.text.primary, // Usando nossa paleta
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  
  // Team Card
  teamCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  
  memberInfo: {
    flex: 1,
  },
  
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary, // Usando nossa paleta
    marginBottom: 2,
  },
  
  memberRole: {
    fontSize: 14,
    color: colors.text.secondary, // Usando nossa paleta
  },
  
  supervisorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
    marginBottom: 8,
  },
  
  // Institutions Card
  institutionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  
  institutionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  
  institutionLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F5F5F5', // Cor fixa para evitar problemas
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  
  institutionInfo: {
    flex: 1,
  },
  
  institutionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  
  institutionFullName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary, // Usando nossa paleta
    marginBottom: 4,
  },
  
  institutionDescription: {
    fontSize: 13,
    color: colors.text.secondary, // Usando nossa paleta
    lineHeight: 18,
  },
  
  // Technical Card
  technicalCard: {
    backgroundColor: colors.surface, // Usando nossa paleta
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 1,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  
  technicalInfo: {
    gap: 8,
  },
  
  technicalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  
  technicalLabel: {
    fontSize: 14,
    color: colors.text.secondary, // Usando nossa paleta
    fontWeight: '500',
  },
  
  technicalValue: {
    fontSize: 14,
    color: colors.text.primary, // Usando nossa paleta
    fontWeight: '600',
  },
  
  // Contact Card
  contactCard: {
    backgroundColor: colors.secondaryLight, // Usando nossa paleta
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  contactDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary, // Usando nossa paleta
    marginBottom: 16,
    textAlign: 'justify',
  },
  
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  
  contactButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  contactButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 16,
  },
  
  footerText: {
    fontSize: 14,
    color: colors.text.secondary, // Usando nossa paleta
    marginLeft: 8,
    fontStyle: 'italic',
  },
  
  // Dividers
  divider: {
    backgroundColor: colors.border, // Usando nossa paleta
    marginVertical: 12,
    height: 1,
  },
});

export default styles;