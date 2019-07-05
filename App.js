/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
// import CalenderScreen from './src/Calender';
// import FormScreen from './src/Form';
// import EditFormScreen from './src/editForm';
import { createStackNavigator, createAppContainer } from "react-navigation";
import CalendarScreen from './src/screen/Calendar';
import LoaderScreen from './src/screen/Loader';

class App extends Component {

  render() {
    return (
      <AppNavigator />
    );
  }
}

const AppNavigator = createStackNavigator({
  Loader: {
    screen: LoaderScreen
  },
  Calendar: {
    screen: CalendarScreen
  },
  // Calender: {
  //   screen: CalenderScreen
  // },
  // Event:{
  //   screen: FormScreen
  // },
  // EditEvent:{
  //   screen: EditFormScreen
  // }
},{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
});

export default createAppContainer(AppNavigator);