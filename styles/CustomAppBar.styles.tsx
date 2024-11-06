import { StyleSheet, StatusBar } from 'react-native';
import colors from '../utils/colors';

const styles = StyleSheet.create({
  appBarContainer: {
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.primary,
  },
});

export default styles;
