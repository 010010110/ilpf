import { StyleSheet } from 'react-native';
import colors from '../utils/colors';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: colors.text,
  },
  button: {
    marginBottom: 20,
    backgroundColor: colors.primary,
  },
  divider: {
    marginVertical: 10,
  },
  cardText: {
    color: colors.background,
    fontSize: 16,
  },
});

export default styles;
