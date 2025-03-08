// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import FormScreen from '../screens/FormScreen';
// import ListScreen from '../screens/ListScreen';
// import ResultScreen from '../screens/ResultScreen';
// import { RootStackParamList } from '@/utils/types';

// const Stack = createStackNavigator<RootStackParamList>();

// export default function Layout() {
//   return (
//     <NavigationContainer independent={true}>
//       <Stack.Navigator initialRouteName="List">
//         <Stack.Screen name="Form" component={FormScreen} options={{ title: 'Entrada de Dados' }} />
//         <Stack.Screen name="List" component={ListScreen} options={{ title: 'Visualizar Dados Salvos' }} />
//         <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Resultados do Cadastro' }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
