import { Platform, StyleSheet } from 'react-native';
import colors from '../utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    color: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 12,
  },
});

export default styles;
