import {navigationRef} from './src/RootNavigation';
import * as RootNavigation from './src/RootNavigation';
import React, {useEffect} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import IndexScreen from './src/screens/IndexScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import UpdateScreen from './src/screens/UpdateScreen';
import ReadScreen from './src/screens/ReadScreen';
import {openDatabase} from 'react-native-sqlite-storage';

import quoteApi from './src/api/quote';
import domApi from './src/api/dom';

import {NativeModules} from 'react-native';
const SharedStorage = NativeModules.SharedStorage;

const Stack = createStackNavigator();

var db = openDatabase({name: 'UserDatabase.db'});

const App = () => {
  const fetchQuote = async () => {
    const result = await quoteApi.get('/random');
    SharedStorage.set(
      JSON.stringify({
        quote: result.data.content + '\n\nBy : “' + result.data.author + '”',
      }),
    );
  };

  const fetchProduct = async () => {
    const result = await domApi.get(
      `/customer/products/${6006 + Math.floor(Math.random() * 201)}`,
    );
    SharedStorage.set(
      JSON.stringify({
        product: result.product_name,
      }),
    );
  };

  useEffect(() => {
    fetchQuote();
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_address VARCHAR(255))',
              [],
            );
          }
        },
      );
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="Index"
          component={IndexScreen}
          options={{
            title: 'Daftar Pengguna', //Set Header Title
            headerStyle: {
              backgroundColor: '#FF206E', //Set Header color
            },
            headerTintColor: '#FFF', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => RootNavigation.navigate('Register')}>
                <Text style={{fontSize: 30, color: 'white', paddingRight: 15}}>
                  +
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Read"
          component={ReadScreen}
          options={{
            title: 'Detail Pengguna', //Set Header Title
            headerStyle: {
              backgroundColor: '#FF206E', //Set Header color
            },
            headerTintColor: '#FFF', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="Update"
          component={UpdateScreen}
          options={{
            title: 'Ubah Pengguna', //Set Header Title
            headerStyle: {
              backgroundColor: '#FF206E', //Set Header color
            },
            headerTintColor: '#FFF', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: 'Pendaftaran Pengguna', //Set Header Title
            headerStyle: {
              backgroundColor: '#FF206E', //Set Header color
            },
            headerTintColor: '#FFF', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
