import React, { Component } from 'react';
import { Button, Text, Textarea, Grid, Row, Col, Card, CardItem } from 'native-base';
import {connect} from 'react-redux'
import DateTimePicker from "react-native-modal-datetime-picker";
import {addEvent, updateEvent, deleteEvent} from '../../../actions/events'
import { TouchableOpacity, View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import SwitchToggle from 'react-native-switch-toggle';
import firebase from 'react-native-firebase';
import moment from 'moment';

import {getDateArray} from '../../utils/getDateArray'
import {convertMonth} from '../../utils/monthConvertor'

var today = new Date();

class EditEventScreen extends Component {
    constructor(props) {
      super(props)
        this.state = {
            id: this.props.data.id,
            title: this.props.data.title,
            startTime: '',
            endTime: '',
            summary: this.props.data.summary,
            fromDate: this.props.data.fromDate,
            toDate: this.props.data.toDate,
            isErrorTitle: false,
            isErrorFromDateTime: false,
            isErrorToDateTime: false,
            isStartTimePickerVisible: false,
            isEndTimePickerVisible: false,
            isFromDatePickerVisible: false,
            isToDatePickerVisible: false,
            isModalVisible: true,
            isSwitchOn: this.props.data.active,
            notificationTime: this.props.data.notificationTime,
            nid: this.props.data.nid
        };
        let date = this.props.data.start.substr(0,10).trim()
        let start = this.props.data.start.substr(11,8).trim()
        let end = this.props.data.end.substr(11,8).trim()
        this.state.startTime = start;
        this.state.endTime = end;
    };
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
    

    handleStartTimePicked = (date) => {
        let datetime = date.toString()
        let day = datetime.substr(8,2)
        let month = datetime.substr(4,3)
        let year = datetime.substr(11,4)
        month = convertMonth(month);
        datetime = year+"-"+month+"-"+day

        let time1 = date.toString()
        time1 = time1.substr(15,9);
        time1 = time1.trim()
        let err = date-today;
        if(err<=0){
            this.setState({
                isErrorFromDateTime: true,
                startTime: time1,
                fromDate: datetime,
            })
        }
        else if(err>0){
            this.setState({
                isErrorFromDateTime: false,
                startTime:time1,
                fromDate: datetime,
                notificationTime: moment(date)
            })
        }
        
        this.hideStartTimePicker();
    };
    handleEndTimePicked = (date) => {
        let datetime = date.toString()
        let day = datetime.substr(8,2)
        let month = datetime.substr(4,3)
        let year = datetime.substr(11,4)
        month = convertMonth(month);
        datetime = year+"-"+month+"-"+day

        let time1 = date.toString()
        time1 = time1.substr(15,10);
        time1 = time1.trim()
        
        let endTime = date.toString()
        date = Date.parse(date)
        end = Date(this.state.EndTime)
        end = Date.parse(end)
        let err = date - end
        if(err <= 0){
            this.setState({
                isErrorToDateTime: true,
                endTime: time1,
                toDate: datetime
            })
        }
        else if(err > 0){
            this.setState({
                isErrorToDateTime: false,
                endTime: time1,
                toDate: datetime
            })
        }
        
        this.hideEndTimePicker();
    };

    hideStartTimePicker = () => {
        this.setState({ isStartTimePickerVisible: false });
    };
    hideEndTimePicker = () => {
        this.setState({ isEndTimePickerVisible: false });
    };
  
    handleUpdateEvent(){
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
        this.props.delete(this.props.data.id);
        
        for(let i=0; i<dateArray.length; i++){
            let fromDate = dateArray[i].toString()+ " " +this.state.startTime;
            let toDate = dateArray[i].toString()+ " " +this.state.endTime;

            if(!this.state.isErrorToDateTime && !this.state.isErrorFromDateTime){
                if(this.state.title.length > 0){
                    this.props.add(this.state.id, this.state.fromDate, this.state.toDate, fromDate, toDate, this.state.title, this.state.summary, this.state.nid, this.state.isSwitchOn, this.state.notificationTime)            
                    this.setReminder();
                    this.props.callback(this.props.visible);                    
                }
                else if(this.state.title.length == 0){
                    let title = '(No Title)'
                    this.props.add(this.state.id, this.state.fromDate, this.state.toDate, fromDate, toDate, this.state.title, this.state.summary, this.state.nid, this.state.isSwitchOn, this.state.notificationTime)            
                    this.setReminder();
                    this.props.callback(this.props.visible);                    
                }
            }
            else if(this.state.isErrorFromDateTime){
            }
            else if(this.state.isErrorToDateTime){
            }

        }
    }

    handleEventSummaryChange=(value)=>{
        this.setState({
            summary: value,
        })
    }
    handleEventTitleChange=(value)=>{
        if(value.length <= 0){
            this.setState({
                isErrorTitle: true,
                title: ''
            })
        }
        else if(value.length > 0){
            this.setState({
                isErrorTitle: false,
                title: value
            })
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Card>
                    <CardItem style={{borderBottomColor: 'lightgrey', borderBottomWidth: 1}}>
                        <Grid>
                            <Col size={90}>
                                <TextInput placeholder="Event Title" name="title"
                                    onChangeText={this.handleEventTitleChange}
                                    ref={(input)=> this.getTitle = input}
                                    value={this.state.title}
                                    style={{fontSize: 20, color:'#E7516F', padding: 0, fontWeight: 'bold',}} />
                            </Col>
                            <Col size={10}>
                                {this.state.isErrorTitle 
                                ?    <Icon name="ios-sad" size={30} style={{color:'red', top:4 }} />
                                :   null
                                }
                            </Col>
                        </Grid>
                    </CardItem>
                    <Textarea ref={(input)=>this.getDescription = input}
                        rowSpan={5} name="description" 
                        onChangeText={this.handleEventSummaryChange}
                        style={{color:'#E7516F'}}
                        value={this.state.summary}
                        placeholder="Event" style={{fontSize: 16}} />
                    <CardItem style={{borderTopColor: 'lightgrey', borderTopWidth: 1}}>
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
                                                {this.state.isErrorFromDateTime
                                                    ? <Text style={{fontSize: 18, fontWeight: 'bold', color:'red'}}>{this.state.fromDate} - {this.state.startTime}</Text>
                                                    : <Text style={{fontSize: 20, fontWeight: 'bold', color:'#686767'}}>{this.state.fromDate} - {this.state.startTime}</Text>
                                                }
                                            </TouchableOpacity>
                                        </View>
                                    </Row>
                                    <Row size={50}>
                                        <View style={{flex: 1, alignItems: 'center',}}>
                                            <TouchableOpacity block onPress={this.showEndTimePicker}>
                                                {this.state.isErrorToDateTime
                                                    ? <Text style={{fontSize: 18, fontWeight: 'bold', color:'red'}}>{this.state.toDate} - {this.state.endTime}</Text>
                                                    : <Text style={{fontSize: 20, fontWeight: 'bold', color:'#686767'}}>{this.state.toDate} - {this.state.endTime}</Text>
                                                }
                                            </TouchableOpacity>
                                            
                                            {/* <Text style={{fontWeight:'bold', paddingLeft: 4, fontSize: 28, color:'#FF9A00'}}>{this.state.endTime}</Text> */}
                                        </View>
                                    </Row>
                                </Col>
                        </Grid>
                        <DateTimePicker mode="datetime" is24Hour={false}
                                isVisible={this.state.isStartTimePickerVisible}
                                onConfirm={this.handleStartTimePicked}
                            onCancel={this.hideStartTimePicker} />
                        <DateTimePicker mode="datetime" is24Hour={false}
                                isVisible={this.state.isEndTimePickerVisible}
                                onConfirm={this.handleEndTimePicked}
                            onCancel={this.hideEndTimePicker} />
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
                    <Button block onPress={() => this.handleUpdateEvent()} >
                        <Text>Update</Text>
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
        add: (id, fromDate, toDate, startTime, endTime, title, summary, nid, isSwitchOn, notificationTime) => {   
            dispatch(addEvent(id, fromDate, toDate, startTime, endTime, title, summary, nid, isSwitchOn, notificationTime))
        },
        update: (id, toDate, fromDate, start, end, title, summary, nid, isSwitchOn, notificationTime) => {   
            dispatch(updateEvent(id, toDate, fromDate, start, end, title, summary, nid, isSwitchOn, notificationTime))
        },
        delete: id => {
            dispatch(deleteEvent(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEventScreen)