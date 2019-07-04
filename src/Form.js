import React, { Component } from 'react';
import { Container, Content, Form, Item, Label, Input, Button, Text, Textarea, Grid, Row, Col, Card, CardItem } from 'native-base';
import {connect} from 'react-redux'
import DateTimePicker from "react-native-modal-datetime-picker";
import {addEvent} from '../actions/events'
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { TextInput } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';

var today = new Date();
var hour = today.getHours() + 1
var start = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var end = hour + ":" + today.getMinutes() + ":" + today.getSeconds();

class FormScreen extends Component {
    state={
        month: '00',
        title: '',
        isErrorTitle: false,
        StartTime: start,
        EndTime: end,
        isErrorEndTime: false,
        toDate: this.props.date,
        isErrorToDate: false,
        fromDate: this.props.date,
        summary: '',
        isStartTimePickerVisible: false,
        isEndTimePickerVisible: false,
        isToDatePickerVisible: false,
        isFromDatePickerVisible: false
    }

    showStartTimePicker = () => {
        this.setState({ isStartTimePickerVisible: true });
    };
    showEndTimePicker = () => {
        this.setState({ isEndTimePickerVisible: true });
    };
    showToDatePicker = () => {
        this.setState({ isToDatePickerVisible: true });
    };
    showFromDatePicker = () => {
        this.setState({ isFromDatePickerVisible: true });
    };
     
    hideStartTimePicker = () => {
        this.setState({ isStartTimePickerVisible: false });
    };
    hideEndTimePicker = () => {
        this.setState({ isEndTimePickerVisible: false });
    };
    hideToDatePicker = () => {
        this.setState({ isToDatePickerVisible: false });
    };
    hideFromDatePicker = () => {
        this.setState({ isFromDatePickerVisible: false });
    };
     
    handleStartTimePicked = (date) => {
        let startTime = date.toString()
        startTime = startTime.substr(15,9).trim();
        this.setState({
            StartTime: startTime,
        })
        this.hideStartTimePicker();
    };
    handleEndTimePicked = (date) => {
        let endTime = date.toString()
        endTime = endTime.substr(15,9).trim();
        let err = parseInt(endTime) - parseInt(this.state.StartTime)
        if(err < 0){
            this.setState({
                isErrorEndTime: true,
                EndTime: endTime,
            })
        }
        else if(err> 0){
            this.setState({
                isErrorEndTime: false,
                EndTime: endTime,
            })
        }
        this.hideEndTimePicker();
    };
    handleToDatePicked = (value) => {
        let datetime = value.toString()
        let day = datetime.substr(8,2).trim()
        let month = datetime.substr(4,3).trim()
        let year = datetime.substr(11,4).trim()
        month = this.convertMonth(month);
        datetime = year+"-"+month+"-"+day
        
        let from = new Date(this.state.fromDate)
        let to = new Date(datetime)
        if(to < from){
           this.setState({
               isErrorToDate: true,
               toDate: datetime
           })
        }
        else if(to >= from){
            this.setState({
                isErrorToDate: false,
                toDate: datetime
            })
        }
        this.hideToDatePicker();
    };
    handleFromDatePicked = (value) => {
        let datetime = value.toString()
        let day = datetime.substr(8,2).trim()
        let month = datetime.substr(4,3).trim()
        let year = datetime.substr(11,4).trim()
        month = this.convertMonth(month);
        datetime = year+"-"+month+"-"+day
        this.setState({
            fromDate: datetime
        })
        this.hideFromDatePicker();
    };

    convertMonth=(month)=>{
        
        switch(month){
            case 'Jan':
                return '01'
            case 'Feb':
                return '02'
            case 'Mar':
                return '03'
            case 'Apr':
                return '04'
            case 'May':
                return '05'
            case 'Jun':
                return '06'
            case 'Jul':
                return '07'
            case 'Aug':
                return '08'
            case 'Sep':
                return '09'
            case 'Oct':
                return '10'
            case 'Nov':
                return '11'
            case 'Dec':
                return '12'
        }
    }

    getDateArray(start, end){
        var arr = [];
        var from = new Date(start);
        var to = new Date(end);
        if(start == end){
            arr.push(new Date(from));
        }
        else if(start != end) {
            while (from <= to) {
                arr.push(new Date(from));
                from.setDate(from.getDate() + 1);
            }
        }
        return arr;
    }

    handleSaveEvent(){
        // let eid = 'id-' + Math.random().toString(36).substr(2, 16);
        let dateArray = []
        var dateArr = this.getDateArray(this.state.fromDate, this.state.toDate);
        for(let i=0; i<dateArr.length; i++){
            let datetime = dateArr[i].toString()
            let day = datetime.substr(8,2).trim()
            let month = datetime.substr(4,3).trim()
            let year = datetime.substr(11,4).trim()
            month = this.convertMonth(month);
            datetime = year+"-"+month+"-"+day;
            dateArray.push(datetime)
        }
        for(let i=0; i<dateArray.length; i++){
            let startDate = dateArray[i].toString()+ " " +this.state.StartTime;
            let toDate = dateArray[i].toString()+ " " +this.state.EndTime;
            if(!this.state.isErrorEndTime && !this.state.isErrorToDate){
                if(this.state.title.length > 0){
                    this.props.add(this.props.event.length, this.state.fromDate, this.state.toDate, startDate, toDate, this.state.title, this.state.summary)
                    this.props.callback(this.props.num);
                }
                else if(this.state.title.length == 0){
                    let title = '(No Title)'
                    this.props.add(this.props.event.length, this.state.fromDate, this.state.toDate, startDate, toDate, title, this.state.summary)
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
                                <View style={{flex: 1,alignItems: 'flex-start'}}>
                                    <Icon name="md-calendar" size={30} style={{color:'#686767', top:4 }} />
                                </View>
                            </Col>
                            <Col size={45} style={{borderRightColor: 'lightgrey', borderRightWidth: 1,}}>
                                <Row size={50}>
                                    <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
                                        <TouchableOpacity block onPress={this.showFromDatePicker}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color:'#686767'}}>{this.state.fromDate}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Row>
                                <Row size={50}>
                                    <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
                                        <TouchableOpacity block onPress={this.showToDatePicker}>
                                            {this.state.isErrorToDate
                                            ? <Text style={{fontSize: 18, fontWeight: 'bold', color:'red',fontWeight: 'bold'}}>{this.state.toDate}</Text>
                                            : <Text style={{fontSize: 20, fontWeight: 'bold', color:'#686767'}}>{this.state.toDate}</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </Row>
                            </Col>
                            <Col size={10}>
                                <View style={{flex: 1,alignItems: 'flex-start'}}>
                                    <Icon name="md-clock" size={30} style={{color:'#686767', top:4, left: 3 }} />
                                </View>
                            </Col>
                            <Col size={35}>
                                <Row size={50}>
                                    <View style={{flex: 1, alignItems: 'center',}}>
                                        <TouchableOpacity block onPress={this.showStartTimePicker}>
                                            <Text style={{fontSize: 20, fontWeight: 'bold', color:'#686767'}}>{this.state.StartTime}</Text> 
                                        </TouchableOpacity>
                                    </View>
                                </Row>
                                <Row size={50}>
                                    <View style={{flex: 1, alignItems: 'center',}}>
                                        <TouchableOpacity block onPress={this.showEndTimePicker}>
                                            {this.state.isErrorEndTime
                                            ? <Text style={{fontSize: 18, fontWeight: 'bold', color:'red',fontWeight: 'bold'}}>{this.state.EndTime}</Text>
                                            : <Text style={{fontSize: 20, fontWeight: 'bold', color:'#686767'}}>{this.state.EndTime}</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </Row>
                            </Col>
                            <DateTimePicker mode="time" is24Hour={false}
                                isVisible={this.state.isStartTimePickerVisible}
                                onConfirm={this.handleStartTimePicked}
                                onCancel={this.hideStartTimePicker}
                            />
                            <DateTimePicker mode="time" is24Hour={false}
                                isVisible={this.state.isEndTimePickerVisible}
                                onConfirm={this.handleEndTimePicked}
                                onCancel={this.hideEndTimePicker}
                            />
                            <DateTimePicker mode="date" is24Hour={false}
                                isVisible={this.state.isToDatePickerVisible}
                                onConfirm={this.handleToDatePicked}
                                onCancel={this.hideToDatePicker}
                            />
                            <DateTimePicker mode="date" is24Hour={false}
                                isVisible={this.state.isFromDatePickerVisible}
                                onConfirm={this.handleFromDatePicked}
                                onCancel={this.hideFromDatePicker}
                            />
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
        add: (id, fromDate, toDate, startTime, endTime, title, summary) => {   
            dispatch(addEvent(id, fromDate, toDate, startTime, endTime, title, summary))
        }
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(FormScreen)