import React, { Component } from 'react';
import { Button, Text, Textarea, Grid, Row, Col, Card, CardItem } from 'native-base';
import {connect} from 'react-redux'
import DateTimePicker from "react-native-modal-datetime-picker";
import {addEvent} from '../../../actions/events'
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { TextInput } from 'react-native-gesture-handler';
import SwitchToggle from 'react-native-switch-toggle';
import moment from 'moment';
import firebase from 'react-native-firebase';

import {getDateArray} from '../../utils/getDateArray'
import {convertMonth} from '../../utils/monthConvertor'
var today = new Date();
var hour = today.getHours() + 1

class AddEventScreen extends Component {
    state={
        isSwitchOn: false,

        month: '00',
        title: '',
        isErrorTitle: false,
        StartTime: this.props.time,
        EndTime: this.props.time,
        isErrorEndTime: false,
        toDate: this.props.date,
        isErrorToDate: false,
        fromDate: this.props.date,
        summary: '',
        isStartTimePickerVisible: false,
        isEndTimePickerVisible: false,
        isToDatePickerVisible: false,
        isFromDatePickerVisible: false,
        notificationTime: moment(today),
        nid: 'nid-' + Math.random().toString(36).substr(2, 16)
    }

    onSwitchToggle = () => {
        this.setState({ isSwitchOn: !this.state.isSwitchOn });
    }
    
    setReminder = async () => {
        const { notificationTime, isSwitchOn } = this.state;
    
        if (isSwitchOn) {
          firebase.notifications().scheduleNotification(this.buildNotification(), {
            fireDate: notificationTime.valueOf(),
            repeatInterval: 'day',
            exact: true,
          });
        } else {
          return false;
        }
    };
    buildNotification = () => {
        const notification = new firebase.notifications.Notification()
          .setNotificationId(this.state.nid)
          .setTitle(this.state.title)
          .setBody(this.state.summary)
          .android.setPriority(firebase.notifications.Android.Priority.High)
          .android.setChannelId('reminder')
          .android.setAutoCancel(true);
        return notification;
    };

    showStartTimePicker = () => {
        this.setState({ isStartTimePickerVisible: true });
    };
    showEndTimePicker = () => {
        this.setState({ isEndTimePickerVisible: true });
    };
   
     
    hideStartTimePicker = () => {
        this.setState({ isStartTimePickerVisible: false });
    };
    hideEndTimePicker = () => {
        this.setState({ isEndTimePickerVisible: false });
    };
   
     
    handleStartTimePicked = (date) => {
        let dy = new Date(date.toString()+"GMT+0600").valueOf();
        dy = new Date(dy)
        let datetime = date.toString()
        let day = datetime.substr(8,2).trim()
        let month = datetime.substr(4,3).trim()
        let year = datetime.substr(11,4).trim()
        month = convertMonth(month);
        datetime = year+"-"+month+"-"+day
        let startTime = date.toString()
        startTime = startTime.substr(15,9).trim();
        this.setState({
            StartTime: startTime,
            fromDate: datetime,
            notificationTime: moment(dy)
        })
        this.hideStartTimePicker();
    };
    handleEndTimePicked = (date) => {
        let datetime = date.toString()
        let day = datetime.substr(8,2).trim()
        let month = datetime.substr(4,3).trim()
        let year = datetime.substr(11,4).trim()
        month = convertMonth(month);
        datetime = year+"-"+month+"-"+day
        
        let endTime = date.toString()
        endTime = endTime.substr(15,9).trim();
        let err = parseInt(endTime) - parseInt(this.state.StartTime)
        if(err <= 0){
            this.setState({
                isErrorEndTime: true,
                EndTime: endTime,
                toDate: datetime
            })
        }
        else if(err> 0){
            this.setState({
                isErrorEndTime: false,
                EndTime: endTime,
                toDate: datetime
            })
        }
        this.hideEndTimePicker();
    };

    handleSaveEvent(){
        let dateArray = []
        var dateArr = getDateArray(this.state.fromDate, this.state.toDate);
        for(let i=0; i<dateArr.length; i++){
            let datetime = dateArr[i].toString()
            let day = datetime.substr(8,2).trim()
            let month = datetime.substr(4,3).trim()
            let year = datetime.substr(11,4).trim()
            month = convertMonth(month);
            datetime = year+"-"+month+"-"+day;
            dateArray.push(datetime)
        }
        for(let i=0; i<dateArray.length; i++){
            let startDate = dateArray[i].toString()+ " " +this.state.StartTime;
            let toDate = dateArray[i].toString()+ " " +this.state.EndTime;
            if(!this.state.isErrorEndTime && !this.state.isErrorToDate){
                if(this.state.title.length > 0){
                    this.props.add(this.props.event.length, this.state.fromDate, this.state.toDate, startDate, toDate, this.state.title, this.state.summary, this.state.nid, this.state.isSwitchOn, this.state.notificationTime)
                    this.setReminder();
                    this.props.callback(this.props.num);
                }
                else if(this.state.title.length == 0){
                    let title = '(No Title)'
                    this.props.add(this.props.event.length, this.state.fromDate, this.state.toDate, startDate, toDate, title, this.state.summary, this.state.nid, this.state.isSwitchOn, this.state.notificationTime)
                    this.setReminder();
                    this.props.callback(this.props.num);
                }
            }
            else if(this.state.isErrorToDate){
            }
            else if(this.state.isErrorEndTime){
            }
        }
    }
    
    handleEventSummaryChange=(value)=>{
        this.setState({
            summary: value,
        })
    }
    handleEventTitleChange=(value)=>{
        if(value.length <= 0 ){
            this.setState({
                isErrorTitle: true,
                title: ''
            })
        }
        else{
            this.setState({
                isErrorTitle: false,
                title: value
            })
        }
    }
    
    render() {
        return (
            <View style={{flex: 1,}}>
                <Card>
                    <CardItem style={{borderBottomColor: 'lightgrey', borderBottomWidth: 1}}>
                        <Grid>
                            <Col size={90}>
                                <TextInput placeholder="Event Title" name="title"
                                    onChangeText={this.handleEventTitleChange}
                                    ref={(input)=> this.getTitle = input}
                                    style={{padding: 0, fontSize: 18, color:'#E7516F', fontWeight: 'bold',}} />
                            </Col>
                            <Col size={10}>
                                {this.state.isErrorTitle ? <Icon name="ios-sad" size={26} style={{color:'red', top: 10}} /> : null }
                            </Col>
                        </Grid>
                    </CardItem>
                    <Textarea ref={(input)=>this.getSummary = input}
                        rowSpan={5} name="summary" 
                        onChangeText={this.handleEventSummaryChange}
                        style={{color:'#E7516F',}}
                        placeholder="Event" style={{fontSize: 16}} />
                    <CardItem style={{borderTopColor: 'lightgrey', borderTopWidth: 1, borderBottomWidth: 1, borderBottomColor: 'lightgrey'}}>
                        <Grid>
                            <Col size={10}>
                                <View style={{flex: 1,alignItems: 'center'}}>
                                    <Icon name="md-clock" size={30} style={{color:'#686767', top:4, left: 3 }} />
                                </View>
                            </Col>
                            <Col size={90}>
                                <Row size={50}>
                                    <View style={{flex: 1, alignItems: 'center',}}>
                                        <TouchableOpacity block onPress={this.showStartTimePicker}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color:'#686767'}}>{this.state.fromDate} - {this.state.StartTime}</Text> 
                                        </TouchableOpacity>
                                    </View>
                                </Row>
                                <Row size={50}>
                                    <View style={{flex: 1, alignItems: 'center',}}>
                                        <TouchableOpacity block onPress={this.showEndTimePicker}>
                                            {this.state.isErrorEndTime
                                            ? <Text style={{fontSize: 18, fontWeight: 'bold', color:'red',fontWeight: 'bold'}}>{this.state.toDate} - {this.state.EndTime}</Text>
                                            : <Text style={{fontSize: 20, fontWeight: 'bold', color:'#686767'}}>{this.state.toDate} - {this.state.EndTime}</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </Row>
                            </Col>
                            <DateTimePicker mode="datetime" is24Hour={false}
                                isVisible={this.state.isStartTimePickerVisible}
                                onConfirm={this.handleStartTimePicked}
                                onCancel={this.hideStartTimePicker}
                            />
                            <DateTimePicker mode="datetime" is24Hour={false}
                                isVisible={this.state.isEndTimePickerVisible}
                                onConfirm={this.handleEndTimePicked}
                                onCancel={this.hideEndTimePicker}
                            />
                        </Grid>
                    </CardItem>
                    <CardItem>
                        <Grid>
                            <Col size={80}>
                                <View style={{alignItems: 'flex-start',}}>
                                    <Text style={{fontSize: 20, top: 4, fontWeight: 'bold', color:'#686767'}}>Enable Notification?</Text>
                                </View>
                            </Col>
                            <Col size={20}>
                                <SwitchToggle
                                    switchOn={this.state.isSwitchOn}
                                    onPress={this.onSwitchToggle}
                                    containerStyle={{
                                        marginTop: 8,
                                        width: 54,
                                        height: 24,
                                        borderRadius: 12.5,
                                        backgroundColor: '#ccc',
                                        padding: 2.5,
                                        }}
                                    circleStyle={{
                                        width: 19,
                                        height: 19,
                                        borderRadius: 9.5,
                                        backgroundColor: 'white', // rgb(102,134,205)
                                    }}
                                />
                            </Col>
                        </Grid>
                    </CardItem>
                    <Button block onPress={() => this.handleSaveEvent()} >
                        <Text>Save</Text>
                    </Button>
                </Card>
            </View>
        );
    }
}

const mapStateToProps = state => {
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
  
export default connect(mapStateToProps, mapDispatchToProps)(AddEventScreen)