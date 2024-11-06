import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import theme from '../utils/theme';
import FormScreen from '../screens/FormScreen';
import ListScreen from '../screens/ListScreen';
import ResultScreen from '../screens/ResultScreen';
import CustomAppBar from '../components/CustomAppBar';
import LoadingScreen from '@/screens/LoadingScreen';

const Stack = createStackNavigator();

export default function App() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer independent={true}>
        <CustomAppBar />
        <Stack.Navigator initialRouteName="List" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Form" component={FormScreen} />
          <Stack.Screen name="List" component={ListScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
