import { StyleSheet } from 'react-native';
import colors from '../utils/colors';

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  background: {
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: colors.surface,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20
  },
  cardText: {
    color: colors.text,
    fontSize: 16,
  },
  cardCalculated: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: colors.text,
  },
  cardTitleCalculated: {
    color: colors.primary,
    fontSize: 20
  },
  cardTextCalculated: {
    color: colors.primary,
    fontSize: 16,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: colors.accent,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
  },
  sectionTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2e7d32',
  marginTop: 24,
  marginBottom: 8,
},

resultRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
},

label: {
  fontWeight: 'bold',
  color: '#444',
},
});

export default styles;
