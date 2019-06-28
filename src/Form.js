import React, { Component } from 'react';
import { Container, Content, Form, Item, Label, Input, Button, Text, Textarea, Grid, Row, Col, Card, CardItem } from 'native-base';
import {connect} from 'react-redux'
import DateTimePicker from "react-native-modal-datetime-picker";
import {addSubEvent, addEvent} from '../actions/events'
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import { TextInput } from 'react-native-gesture-handler';

class FormScreen extends Component {
    state={
        month: '00',
        title: '',
        isErrorTitle: false,
        StartTime: '',
        EndTime: '',
        isErrorEndTime: false,
        date: '',
        summary: '',
        isStartTimePickerVisible: false,
        isEndTimePickerVisible: false,
        isDatePickerVisible: false
    }

    showStartTimePicker = () => {
        this.setState({ isStartTimePickerVisible: true });
    };
    showEndTimePicker = () => {
        this.setState({ isEndTimePickerVisible: true });
    };
    showDatePicker = () => {
        this.setState({ isDatePickerVisible: true });
    };
     
    hideStartTimePicker = () => {
        this.setState({ isStartTimePickerVisible: false });
    };
    hideEndTimePicker = () => {
        this.setState({ isEndTimePickerVisible: false });
    };
    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };
     
    handleStartTimePicked = (date) => {
        let time1 = date.toString()
        time1 = time1.substr(15,9);
        this.setState({
            StartTime: time1,
        })
        this.hideStartTimePicker();
    };
    handleEndTimePicked = (date) => {
        let time1 = date.toString()
        time1 = time1.substr(15,9);
        
        let err = parseInt(time1) - parseInt(this.state.StartTime)
        if(err < 0){
            this.setState({
                isErrorEndTime: true,
                EndTime: 'Time Must be greater than Start Time',
            })
        }
        else{
            this.setState({
                isErrorEndTime: false,
                EndTime: time1,
            })
        }
        this.hideEndTimePicker();
    };
    handleDatePicked = (value) => {
        let datetime = value.toString()
        let day = datetime.substr(8,2)
        let month = datetime.substr(4,3)
        let year = datetime.substr(11,4)
        this.convertMonth(month);
        datetime = year+"-"+this.state.month+"-"+day
        this.setState({
            date: datetime
        })
        this.hideDatePicker();
    };

    convertMonth=(month)=>{
        
        switch(month){
            case 'Jan':
                return this.setState({ month: '01' });
            case 'Feb':
                return this.setState({ month: '02' });
            case 'Mar':
                return this.setState({ month: '03' });
            case 'Apr':
                return this.setState({ month: '04' });
            case 'May':
                return this.setState({ month: '05' });
            case 'Jun':
                return this.setState({ month: '06' });
            case 'Jul':
                return this.setState({ month: '07' });
            case 'Aug':
                return this.setState({ month: '08' });
            case 'Sep':
                return this.setState({ month: '09' });
            case 'Oct':
                return this.setState({ month: '10' });
            case 'Nov':
                return this.setState({ month: '11' });
            case 'Dec':
                return this.setState({ month: '12' });
        }
    }

    handleSaveEvent(){
        this.state.StartTime = this.state.date+ "" +this.state.StartTime;
        this.state.EndTime = this.state.date+ "" +this.state.EndTime;
        if(this.state.title.length > 0){
            if(!this.state.isErrorEndTime){
                this.props.add(this.props.event.length, this.state.StartTime, this.state.EndTime, this.state.title, this.state.summary)
                this.props.callback(this.props.num);
            }
        }
        else{
            alert('Fields are empty!')
        }
        
    }
    
   
    handleEventSummaryChange=(value)=>{
        this.setState({
            summary: value,
        })
    }
    handleEventTitleChange=(value)=>{
        if(value.length == 0 ){
            this.setState({
                isErrorTitle: true,
            })
        }
        else{
            this.setState({
                title: value
            })
        }
    }
    
    render() {
        return (
            <Container>
                <Content padder>
                        {/* <View style={{flexDirection: 'row',}}>
                            {/* <Icon name="chevron-left" size={40} style={{color: 'grey'}}/> 
                            <Text style={{color: 'grey', fontSize: 17,left: 7, top: 4, fontWeight:'bold'}}>Event no. {this.state.id} Details</Text>
                        </View> */}
                    <Card>
                        <CardItem style={{borderBottomColor: 'grey', borderBottomWidth: 1}}>
                            <Grid>
                                {/* <Col size={10}>
                                    <Icon name="link" size={30} style={{color: '#E7516F', top: 3}} />
                                </Col> */}
                                <Col size={90}>
                                    <TextInput placeholder="Event Title" name="title"
                                        onChangeText={this.handleEventTitleChange}
                                        ref={(input)=> this.getTitle = input}
                                        style={{fontSize: 20, color:'#E7516F', fontWeight: 'bold',}} />
                                </Col>
                                <Col size={10}>
                                    {this.state.isErrorTitle ? <Icon name="frown" size={26} style={{color:'red', top: 10}} /> : null }
                                </Col>
                            </Grid>
                        </CardItem>
                        <Textarea ref={(input)=>this.getSummary = input}
                            rowSpan={5} name="summary" 
                            onChangeText={this.handleEventSummaryChange}
                            style={{color:'#E7516F'}}
                            placeholder="Event" style={{fontSize: 18}} />
                        <CardItem style={{borderTopColor: 'grey', borderTopWidth: 1}}>
                            <Grid>
                                <Col size={85}>
                                    <View style={{flexDirection: 'row', left: 0}}>
                                        <TouchableOpacity block onPress={this.showDatePicker}>
                                            <Icon name="calendar" size={28} style={{color: 'blue', top: 8}} />                                                
                                        </TouchableOpacity>
                                        <Text style={{left: 0, fontWeight:'bold', textAlign: 'center', fontSize: 28, color:'#FF9A00'}}>{this.state.date}</Text>
                                    </View>
                                </Col>
                            </Grid>
                        </CardItem>
                        <CardItem style={{borderTopColor: 'grey', borderTopWidth: 1}}>
                            <Grid>
                                <Col size={85}>
                                    <View style={{flexDirection: 'row',}}>
                                        <TouchableOpacity block onPress={this.showStartTimePicker}>
                                            <Icon name="clockcircleo" size={25} style={{left: 0, color: 'blue', top: 8}} />
                                        </TouchableOpacity>
                                        <Text style={{fontWeight:'bold', left: 5, fontSize: 28, color:'#FF9A00'}}>Start: {this.state.StartTime}</Text>
                                    </View>
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
                                    isVisible={this.state.isDatePickerVisible}
                                    onConfirm={this.handleDatePicked}
                                    onCancel={this.hideDatePicker}
                                />
                            </Grid>
                        </CardItem>
                        <CardItem style={{borderTopColor: 'grey', borderTopWidth: 1}}>
                            <Grid>
                                <Col size={85}>
                                    <View style={{flexDirection: 'row',}}>
                                        <TouchableOpacity block onPress={this.showEndTimePicker}>
                                            <Icon name="clockcircleo" size={25} style={{left: 0, color: 'blue', top: 8}} />
                                        </TouchableOpacity>
                                        {this.state.isErrorEndTime
                                            ? <Text style={{fontWeight:'bold', left: 5, fontSize: 20, color:'red'}}>End: {this.state.EndTime}</Text>
                                            : <Text style={{fontWeight:'bold', left: 5, fontSize: 28, color:'#FF9A00'}}>End: {this.state.EndTime}</Text>
                                        }
                                    </View>
                                </Col>
                            </Grid>
                        </CardItem>
                        <Button block style={{marginTop: 10,}} onPress={() => this.handleSaveEvent()} >
                            <Text>Save</Text>
                        </Button>
                    </Card>
                </Content>
            </Container>
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
        add: (id, startTime, endTime, title, summary) => {   
            dispatch(addEvent(id, startTime, endTime, title, summary))
        }
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(FormScreen)