import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import FormScreen from '@/screens/FormScreen';
import EditScreen from '@/screens/EditScreen';
import ResultScreen from '@/screens/ResultScreen';
import MainTabs from '@/components/MainTabs';
import { useEffect, useState } from 'react';
import { initDb, resetDatabase } from '@/database/db';
import LoadingScreen from '@/screens/LoadingScreen';

const Stack = createStackNavigator();
export default function App() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await initDb();
      setIsLoading(false);
    };
    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        id="root"
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Form" component={FormScreen} />
        <Stack.Screen name="Edit" component={EditScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
