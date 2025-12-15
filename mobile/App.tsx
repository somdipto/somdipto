import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import RootNavigator from '@/navigation/RootNavigator';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import './global.css';

export default function App() {
  const { colorScheme } = useColorScheme();
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}
