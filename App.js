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
import DemoScreen from './src/DemoScreen';

class App extends Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}

const AppNavigator = createStackNavigator({
  Demo: {
    screen: DemoScreen
  },
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