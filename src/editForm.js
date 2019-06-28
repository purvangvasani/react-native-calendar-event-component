import React, { Component } from 'react';
import { Container, Content, Form, Item, Label, Input, Button, Text, Textarea, Grid, Row, Col, Card, CardItem } from 'native-base';
import {connect} from 'react-redux'
import DateTimePicker from "react-native-modal-datetime-picker";
import {addEvent, updateEvent} from '../actions/events'
import { TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/EvilIcons'

class EditFormScreen extends Component {
    constructor(props) {
      super(props)
        this.state = {
            id: this.props.data.id,
            title: this.props.data.title,
            start: '',
            end: '',
            summary: this.props.data.summary,
            date: '',
            isErrorEndTime: false,
            isStartTimePickerVisible: false,
            isEndTimePickerVisible: false,
            isDatePickerVisible: false,
            isModalVisible: true
        };
        let date = this.props.data.start.substr(0,10)
        let start = this.props.data.start.substr(11,8)
        let end = this.props.data.end.substr(11,8)
        this.state.date = date;
        this.state.start = start;
        this.state.end = end;
    };

    showStartTimePicker = () => {
        this.setState({ isStartTimePickerVisible: true });
    };
    showEndTimePicker = () => {
        this.setState({ isEndTimePickerVisible: true });
    };
    showDatePicker = () => {
        this.setState({ isDatePickerVisible: true });
    };

    handleStartTimePicked = (date) => {
        let time1 = date.toString()
        time1 = time1.substr(15,9);
        this.setState({
            start: time1,
        })
        this.hideStartTimePicker();
    };
    handleEndTimePicked = (date) => {
        let time1 = date.toString()
        time1 = time1.substr(15,10);
        let err = parseInt(time1) - parseInt(this.state.start)
        if(err < 0){
            this.setState({
                isErrorEndTime: true,
                end: 'Time Must be greater than Start Time',
            })
        }
        else{
            this.setState({
                isErrorEndTime: false,
                end: time1,
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
     
    hideStartTimePicker = () => {
        this.setState({ isStartTimePickerVisible: false });
    };
    hideEndTimePicker = () => {
        this.setState({ isEndTimePickerVisible: false });
    };
    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };

    handleUpdateEvent(){
        this.state.start = this.state.date+ "" +this.state.start;
        this.state.end = this.state.date+ "" +this.state.end;
        this.props.update(this.state.id, this.state.start, this.state.end, this.state.title, this.state.summary)
        this.props.callback(this.props.visible);
    }

    handleEventDescriptionChange=(value)=>{
        this.setState({
            summary: value,
        })
    }
    handleEventHeadingChange=(value)=>{
        this.setState({
            title: value
        })
    }

    render() {
        
        return (
            <Container>
                <Content padder>
                        <View style={{flexDirection: 'row',}}>
                            <Text style={{color: 'grey', fontSize: 17,left: 7, top: 4, fontWeight:'bold'}}>Event no. {this.state.id} Details</Text>
                        </View>
                    <Card>
                        <CardItem style={{borderBottomColor: 'grey', borderBottomWidth: 1}}>
                            <Grid>
                                <Col size={90}>
                                    <Input placeholder="Event Title" name="title"
                                        onChangeText={this.handleEventHeadingChange}
                                        ref={(input)=> this.getTitle = input}
                                        value={this.state.title}
                                        style={{fontSize: 20, color:'#E7516F', fontWeight: 'bold',}} />
                                </Col>
                            </Grid>
                        </CardItem>
                        <Textarea ref={(input)=>this.getDescription = input}
                            rowSpan={5} name="description" 
                            onChangeText={this.handleEventDescriptionChange}
                            style={{color:'#E7516F'}}
                            value={this.state.summary}
                            placeholder="Event" style={{fontSize: 18}} />
                        <CardItem style={{borderTopColor: 'grey', borderTopWidth: 1}}>
                            <Grid>
                                <Col size={60}>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity block onPress={this.showDatePicker}>
                                            <Icon name="calendar" size={32} style={{color: 'blue', top: 7}} />                                                
                                        </TouchableOpacity>
                                        <Text style={{left: 2, fontWeight:'bold', textAlign: 'center', fontSize: 28, color:'#FF9A00'}}>{this.state.date}</Text>
                                    </View>
                                </Col>
                            </Grid>
                        </CardItem>
                        <CardItem style={{borderTopColor: 'grey', borderTopWidth: 1}}>
                            <Grid>
                                <Col size={60}>
                                    <View style={{flexDirection: 'row',}}>
                                        <TouchableOpacity block onPress={this.showStartTimePicker}>
                                            <Icon name="clock" size={32} style={{left: 2, color: 'blue', top: 7}} />
                                        </TouchableOpacity>
                                        <Text style={{fontWeight:'bold', paddingLeft: 4, fontSize: 28, color:'#FF9A00'}}>{this.state.start}</Text>
                                    </View>
                                </Col>
                                <DateTimePicker mode="time" is24Hour={false}
                                    isVisible={this.state.isStartTimePickerVisible}
                                    onConfirm={this.handleStartTimePicked}
                                    onCancel={this.hideStartTimePicker} />
                                <DateTimePicker mode="time" is24Hour={false}
                                    isVisible={this.state.isEndTimePickerVisible}
                                    onConfirm={this.handleEndTimePicked}
                                    onCancel={this.hideEndTimePicker} />
                                <DateTimePicker mode="date" is24Hour={false}
                                    isVisible={this.state.isDatePickerVisible}
                                    onConfirm={this.handleDatePicked}
                                    onCancel={this.hideDatePicker} />
                            </Grid>
                        </CardItem>
                        <CardItem style={{borderTopColor: 'grey', borderTopWidth: 1}}>
                            <Grid>
                                <Col size={60}>
                                    <View style={{flexDirection: 'row',}}>
                                        <TouchableOpacity block onPress={this.showEndTimePicker}>
                                            <Icon name="clock" size={32} style={{left: 2, color: 'blue', top: 7}} />
                                        </TouchableOpacity>
                                        {this.state.isErrorEndTime
                                            ? <Text style={{fontWeight:'bold', paddingLeft: 4, fontSize: 22, color:'red'}}>{this.state.end}</Text>
                                            : <Text style={{fontWeight:'bold', paddingLeft: 4, fontSize: 28, color:'#FF9A00'}}>{this.state.end}</Text>
                                        }
                                        {/* <Text style={{fontWeight:'bold', paddingLeft: 4, fontSize: 28, color:'#FF9A00'}}>{this.state.end}</Text> */}
                                    </View>
                                </Col>
                            </Grid>
                        </CardItem>
                        <Button block style={{marginTop: 10,}} onPress={() => this.handleUpdateEvent()} >
                            <Text>Update</Text>
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
        update: (id, start, end, title, summary) => {   
            dispatch(updateEvent(id, start, end, title, summary))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditFormScreen)