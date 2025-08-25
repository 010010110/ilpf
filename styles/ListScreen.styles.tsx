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
  emptyContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
},

emptyText: {
  fontSize: 16,
  textAlign: 'center',
  marginBottom: 16,
  color: '#888',
},

emptyImage: {
  width: 200,
  height: 200,
  opacity: 0.5,
},

fab: {
  position: 'absolute',
  right: 16,
  bottom: 16,
  backgroundColor: '#2e7d32',
  zIndex: 1000,
  elevation: 4,
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 6,
},
label: {
  color: colors.primary,
  fontWeight: 'bold',
},
value: {
  color: colors.background,
},

});

export default styles;
