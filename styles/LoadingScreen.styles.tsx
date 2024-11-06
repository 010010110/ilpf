import { StyleSheet } from 'react-native';
import colors from '../utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ac784a',
  },
  mainLogo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  activityIndicator: {
    marginTop: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 20,
    color: colors.background,
    textAlign: 'center'
  },
  logoContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});

export default styles;
