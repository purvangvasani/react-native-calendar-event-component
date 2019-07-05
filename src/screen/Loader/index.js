import React, { Component } from 'react'
import {connect} from 'react-redux'
import {addEvent} from '../../../actions/events'
import AsyncStorage from '@react-native-community/async-storage'
import LottieLoader from 'react-native-lottie-loader';

class LoaderScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            events: '',
            visible: true
        }
        this.checkStoredEvents();
    }

    componentDidMount() {
        const context = this;
    
        setTimeout(() => {
            context.setState({ visible: false });
        }, 3000);
    }

    checkStoredEvents=()=>{
        try{
            AsyncStorage.getItem('DEMO').then((value) => {
                if(value != null){
                    if(JSON.parse(value).length != 0){
                        if(this.props.event.length == 0){
                            for(let i=0; i<JSON.parse(value).length; i++){
                                this.props.add(JSON.parse(value)[i].id, JSON.parse(value)[i].fromDate, JSON.parse(value)[i].toDate, JSON.parse(value)[i].start, JSON.parse(value)[i].end, JSON.parse(value)[i].title, JSON.parse(value)[i].summary, JSON.parse(value)[i].nid, JSON.parse(value)[i].active, JSON.parse(value)[i].notificationTime);
                            }
                        }
                        this.props.navigation.navigate('Calendar')
                    }
                    // else if(JSON.parse(value).length == 0){
                    //     this.props.navigation.navigate('Calendar')
                    // }
                }
                // else{
                //     this.props.navigation.navigate('Calendar')
                // }
                this.props.navigation.navigate('Calendar')
            })
        }
        catch{
            this.props.navigation.navigate('Calendar')
        }
    }
    
    render() {
        const { visible } = this.state;
        return (
            <LottieLoader visible={visible} />
        )
    }
}

const mapStateToProps = state => {
    console.log('Store Data', state.event.events);
    return {
        event: state.event.events
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
        add: (id, fromDate, toDate, startTime, endTime, title, summary, nid, active, notificationTime) => {   
            dispatch(addEvent(id, fromDate, toDate, startTime, endTime, title, summary, nid, active, notificationTime))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoaderScreen)