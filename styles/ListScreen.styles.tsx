import { StyleSheet } from 'react-native';
import colors from '../utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Espaço extra no final para não cobrir o FAB
  },
  
  // Cards principais
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', // Para garantir que o conteúdo não vaze
  },
  
  cardIncomplete: {
    backgroundColor: colors.incomplete.background,
    borderRadius: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.incomplete.border,
    elevation: 3,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  
  cardComplete: {
    backgroundColor: colors.complete.background,
    borderRadius: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.complete.border,
    elevation: 2,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  
  // Layout do card
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 120,
  },
  
  cardActionsLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRightWidth: 1,
    borderRightColor: colors.borderLight,
    minWidth: 60,
  },
  
  cardMainContent: {
    flex: 1,
    padding: 16,
  },
  
  cardHeader: {
    marginBottom: 12,
  },
  
  cardInfo: {
    flex: 1,
  },
  
  // Conteúdo dos cards
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  
  cardTitleIncomplete: {
    color: colors.incomplete.text,
  },
  
  cardTitleComplete: {
    color: colors.complete.text,
  },
  
  cardSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  
  // Linhas de informação (mantendo compatibilidade com código existente)
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 2,
  },
  
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    flex: 1,
  },
  
  labelIncomplete: {
    color: colors.incomplete.text,
  },
  
  labelComplete: {
    color: colors.complete.text,
  },
  
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'right',
  },
  
  valueIncomplete: {
    color: colors.incomplete.text,
  },
  
  valueComplete: {
    color: colors.complete.text,
  },
  
  // Status badges
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  
  statusBadgeIncomplete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  
  statusBadgeComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.success,
  },
  
  statusIcon: {
    marginRight: 4,
  },
  
  statusTextIncomplete: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  statusTextComplete: {
    color: colors.success,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Ações dos cards
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  
  actionButton: {
    marginLeft: 8,
  },
  
  // FAB (Floating Action Button)
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: colors.primary,
    elevation: 8, // Aumentado para garantir que fique por cima
    zIndex: 1000, // Z-index alto para sobrepor tudo
    shadowColor: colors.shadow.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  
  // Lista vazia
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  
  emptyIllustration: {
    width: 280,
    height: 280,
    opacity: 0.7,
  },
  
  // Divisores
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 8,
  },
  
  // Header da tela
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  
  headerIcon: {
    marginRight: 12,
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  
  // Estados de loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
});

export default styles;