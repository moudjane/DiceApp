import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ShopScreen } from './component/ShopScreen'
import { HomeScreen } from './component/HomeScreen'
import { QuizScreen } from './component/QuizScreen'
import Ionicons from 'react-native-vector-icons/Ionicons';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tab = createBottomTabNavigator();

// This allows to get all the pages from Airtable API and to store all the records in the same object
async function fetchAllPages(table, maxRetries = 3) {
  let offset = "0";
  let allPages = [];
  let numRetries = 0;

  while (offset) {
    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.airtable.com/v0/app3XPPuSGjToCEb4/${table}?offset=${offset}`,
      headers: {
        'Authorization': 'Bearer patQJydkf0Hoyfgvm.094b5d412419f9835f9cfa092fadf7691e5335e91b1243de377db72aa3711762',
        'Cookie': 'acq=eyJyZWRpcmVjdFRvQWZ0ZXJMb2dpbiI6Ii9hcHBDWHU3cHM0eDlCVGFKRiJ9; acq.sig=YPq3kdx_wGs0-tpn4OX4Qag8MzlJPjmhc9zbnBpZj7o; brw=brwxOtdn8XFzAPYrf; AWSALB=8su2pdGhHeZa8U7WpIr58tuaqGckEzYdiaRMNRKwEXm+HZAF8byPGdYZq4GnrLtXPrTbgFV025sKzYglL1rI/wy94WAJf8p6w5y0vn296l7VEKGaPfY/ysY/+tqW; AWSALBCORS=8su2pdGhHeZa8U7WpIr58tuaqGckEzYdiaRMNRKwEXm+HZAF8byPGdYZq4GnrLtXPrTbgFV025sKzYglL1rI/wy94WAJf8p6w5y0vn296l7VEKGaPfY/ysY/+tqW'
      }
    };

    try {
      let res = await axios(config);
      for (let i = 0; i < res.data.records.length; i++) {
        allPages.push(res.data.records[i])
      }
      offset = res.data.offset;
    } catch (error) {
      numRetries++;
      if (numRetries > maxRetries) {
        throw new Error(`Failed to fetch data after ${maxRetries} retries`);
      }
      console.log(`Error fetching data, retrying (${numRetries}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      continue;
    }
  }

  return allPages;
}


function App() {

  const [games, setGames] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [credentials, setCredentials] = useState([]);



  useEffect(() => {

    const fetchGames = async () => {
      try {
        const json = (await fetchAllPages('Games'))
        setGames(json);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchQuestions = async () => {
      try {
        const json = (await fetchAllPages('Questions'))
        setQuestions(json);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchCredentials = async () => {
      try {
        const json = (await fetchAllPages('Credentials'))
        setCredentials(json);
      } catch (error) {
        console.error(error);
      }
    };



    fetchGames();
    fetchQuestions();
    fetchCredentials();
  }, []);

  // NAVIGATION
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Quiz"
        barStyle={{ backgroundColor: '#062c49' }}
        screenOptions={({ route }) => ({
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#062c49',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconColor = focused ? '#e9bd1f' : 'white';
            if (route.name == 'Home') {
              iconName = 'home'
            } else if (route.name == 'Quiz') {
              iconName = 'help'
            } else if (route.name == 'Shop') {
              iconName = 'card'
            }
            return <Ionicons name={iconName} size={28} color={iconColor} />
          },
          tabBarActiveTintColor: '#e9bd1f',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#062c49',
            display: 'flex',
          },
        })}
      >
        <Tab.Screen name='Home' component={HomeScreen} />
        <Tab.Screen name='Quiz'>
          {() => <QuizScreen games={games} questions={questions} credentials={credentials} />}
        </Tab.Screen>
        <Tab.Screen name='Shop' component={ShopScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );

}

export default App;