import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Container, Spinner } from 'native-base';
import {connect} from 'react-redux'
import {addEvent} from '../actions/events'
import AsyncStorage from '@react-native-community/async-storage'

class LoaderScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            events: ''
        }
        this.checkStoredEvents();
    }

    checkStoredEvents=()=>{
        try{
            AsyncStorage.getItem('DEMO').then((value) => {
                // console.log('====================================');
                // console.log('JSON.parse(value).length != 0: ', value != null);
                // console.log('====================================');
                if(value != null){
                    // console.log('====================================');
                    // console.log(JSON.parse(value));
                    // console.log('====================================');
                    if(JSON.parse(value).length != 0){
                        // console.log('====================================');
                        // console.log('Data not Null', value.length);
                        // console.log(JSON.parse(value));
                        // console.log('====================================');
                        for(let i=0; i<JSON.parse(value).length; i++){
                            // console.log('====================================');
                            // console.log(JSON.parse(value)[i].id, JSON.parse(value)[i].start, JSON.parse(value)[i].end, JSON.parse(value)[i].title, JSON.parse(value)[i].summary);
                            // console.log('====================================');
                            this.props.add(JSON.parse(value)[i].id, JSON.parse(value)[i].start, JSON.parse(value)[i].end, JSON.parse(value)[i].title, JSON.parse(value)[i].summary);
                        }
                        // console.log('====================================');
                        // console.log('for loop over');
                        // console.log('====================================');
                        this.props.navigation.navigate('Demo')
                    }
                    else if(JSON.parse(value).length == 0){
                        this.props.navigation.navigate('Demo')
                    }
                }
                else{
                    this.props.navigation.navigate('Demo')
                }
            })
        }
        catch{
            console.log('====================================');
            console.log('NO DATA AVAILABLE');
            console.log('====================================');
            this.props.navigation.navigate('Demo')
        }
    }
    
    render() {
        return (
            <Container style={{backgroundColor: 'lightblue'}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                    {/* <DoubleBounce size={10} color="#1CAFF6" style={{textAlign: 'center'}} /> */}
                    <Spinner color='white' />
                    <Text style={{color:'white', fontSize: 18, fontWeight: 'bold',}}>Loading...</Text>
                </View>
            </Container>
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
        add: (id, startTime, endTime, title, summary) => {   
            dispatch(addEvent(id, startTime, endTime, title, summary))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoaderScreen)