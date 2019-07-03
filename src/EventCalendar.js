import React, { Component } from 'react'
import { Text, View } from 'react-native'
import EventCalendar from 'react-native-events-calendar'
import AsyncStorage from '@react-native-community/async-storage'

export default class EventCalendarScreen extends Component {
    
    constructor(props) {
        super(props)
        this.state={
            events: ''
        }
    };

    componentDidMount() {
        try {
            AsyncStorage.getItem('demo').then((data)=>{
                this.setState({
                    events: JSON.parse(data)
                })
                console.log('fetched data:-', JSON.parse(data));
            })
        } catch (error) {
            console.log(error.message);
        }
    }
    
    
    render() {
        console.log('====================================');
        console.log(this.state.events);
        console.log('====================================');
            return (
                <EventCalendar
                    // eventTapped={this.eventClicked.bind(this)}
                    events={this.state.events}
                    width={this.props.width}
                    size={30}
                    format24h={true}
                    initDate={this.props.initDate}
                    scrollToFirst
                />
            )
    }
}
