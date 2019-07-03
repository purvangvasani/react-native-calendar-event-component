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
import LoaderScreen from './src/LoaderScreen';

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
  Demo: {
    screen: DemoScreen
  },
  Agenda: {
    screen: AgendaScreen
  },
  Calender: {
    screen: CalenderScreen
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