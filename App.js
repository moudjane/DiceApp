import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SettingsScreen } from './component/SettingsScreen'
import { HomeScreen } from './component/HomeScreen'
import { QuizScreen } from './component/QuizScreen'
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconColor = focused ? '#3791F3' : 'gray';
            if (route.name == 'Home') {
              iconName = 'home'
            } else if (route.name == 'Quiz') {
              iconName = 'help'
            } else if (route.name == 'Settings') {
              iconName = 'settings'
            }
            return <Ionicons name={iconName} size={28} color={iconColor} />
          }
        })}
      >
        <Tab.Screen name='Home' component={HomeScreen} />
        <Tab.Screen name='Quiz' component={QuizScreen} />
        <Tab.Screen name='Settings' component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer >
  );
}

export default App;