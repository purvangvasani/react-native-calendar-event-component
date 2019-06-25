/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import CalenderScreen from './src/Calender';
import FormScreen from './src/Form';
import EditFormScreen from './src/editForm';
import { createStackNavigator, createAppContainer } from "react-navigation";
import AgendaScreen from './src/Agenda';

class App extends Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}

const AppNavigator = createStackNavigator({
  Calender: {
    screen: CalenderScreen
  },
  Agenda: {
    screen: AgendaScreen
  },
  Event:{
    screen: FormScreen
  },
  EditEvent:{
    screen: EditFormScreen
  }
},{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
});

export default createAppContainer(AppNavigator);