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


// <NavigationContainer>
//   <Tab.Navigator>
//     <Tab.Screen name="Home" component={HomeScreen} />
//     <Tab.Screen name="Settings" component={SettingsScreen} />
//     <Tab.Screen name="Quiz" component={QuizScreen} />
//   </Tab.Navigator>
// </NavigationContainer>



// import React from 'react';
// import {
//   StyleSheet,
//   Button,
//   View,
//   SafeAreaView,
//   Text,
//   Alert,
//   Image,
//   TextInput
// } from 'react-native';
// // import { Input } from 'react-native-elements';


// const Separator = () => <View style={styles.separator} />;

// const App = () => (
//   <SafeAreaView style={styles.container}>
//     <View style={styles.container2}>
//       <Image source={require('./assets/Dice.png')} style={styles.image}
//       />
//       <TextInput style={styles.input}
//         placeholder='BASIC INPUT'
//       />
//     </View>
//     <View>

//       <Text style={styles.title}>
//         The title and onPress handler are required. It is recommended to set
//         accessibilityLabel to help make your app usable by everyone.

//       </Text>


//     </View>

//     <Separator />
//     <View>
//       <Text style={styles.title}>
//         Adjust the color in a way that looks standard on each platform. On iOS,
//         the color prop controls the color of the text. On Android, the color
//         adjusts the background color of the button.
//       </Text>
//       <Button
//         title="Press me"
//         color="#f194ff"
//         onPress={() => Alert.alert('Button with adjusted color pressed')}
//       />
//     </View>
//     <Separator />
//     <View>
//       <Text style={styles.title}>
//         All interaction for the component are disabled.
//       </Text>
//       <Button
//         title="Press me"
//         disabled
//         onPress={() => Alert.alert('Cannot press this one')}
//       />
//     </View>
//     <Separator />
//     <View>
//       <Text style={styles.title}>
//         This layout strategy lets the title define the width of the button.
//       </Text>
//       <View style={styles.fixToText}>
//         <Button
//           title="Left button"
//           onPress={() => Alert.alert('Left button pressed')}
//         />
//         <Button
//           title="Right button"
//           onPress={() => Alert.alert('Right button pressed')}
//         />
//       </View>
//     </View>
//   </SafeAreaView>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     marginHorizontal: 16,
//   },
//   title: {
//     textAlign: 'center',
//     marginVertical: 8,
//   },
//   fixToText: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   separator: {
//     marginVertical: 8,
//     borderBottomColor: '#737373',
//     borderBottomWidth: StyleSheet.hairlineWidth,
//   },
//   image: {
//     width: 300,
//     height: 200,
//   },
//   container2: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   input: {

//   }
// });

export default App;