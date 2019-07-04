import React, { Component } from 'react';
import { Container, Content, Form, Item, Label, Input, Button, Text, Textarea, Grid, Row, Col, Card, CardItem } from 'native-base';
import {connect} from 'react-redux'
import DateTimePicker from "react-native-modal-datetime-picker";
import {addEvent, updateEvent, deleteEvent} from '../actions/events'
import { TouchableOpacity, View, TextInput } from 'react-native';
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
            fromDate: this.props.data.fromDate,
            toDate: this.props.data.toDate,
            isErrorEndTime: false,
            isStartTimePickerVisible: false,
            isEndTimePickerVisible: false,
            isFromDatePickerVisible: false,
            isToDatePickerVisible: false,
            isModalVisible: true
        };
        let date = this.props.data.start.substr(0,10).trim()
        let start = this.props.data.start.substr(11,8).trim()
        let end = this.props.data.end.substr(11,8).trim()
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
    showFromDatePicker = () => {
        this.setState({ isFromDatePickerVisible: true });
    };
    showToDatePicker = () => {
        this.setState({ isToDatePickerVisible: true });
    };

    handleStartTimePicked = (date) => {
        let time1 = date.toString()
        time1 = time1.substr(15,9);
        time1 = time1.trim()
        this.setState({
            start: time1,
        })
        this.hideStartTimePicker();
    };
    handleEndTimePicked = (date) => {
        let time1 = date.toString()
        time1 = time1.substr(15,10);
        time1 = time1.trim()
        let err = parseInt(time1) - parseInt(this.state.start)
        if(err < 0){
            this.setState({
                isErrorEndTime: true,
                end: 'Invalid Time',
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
    handleFromDatePicked = (value) => {
        let datetime = value.toString()
        let day = datetime.substr(8,2)
        let month = datetime.substr(4,3)
        let year = datetime.substr(11,4)
        month = this.convertMonth(month);
        datetime = year+"-"+month+"-"+day
        this.setState({
            fromDate: datetime
        })
        this.hideFromDatePicker();
    };
    handleToDatePicked = (value) => {
        let datetime = value.toString()
        let day = datetime.substr(8,2)
        let month = datetime.substr(4,3)
        let year = datetime.substr(11,4)
        month = this.convertMonth(month);
        datetime = year+"-"+month+"-"+day
        this.setState({
            toDate: datetime
        })
        this.hideToDatePicker();
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
     
    hideStartTimePicker = () => {
        this.setState({ isStartTimePickerVisible: false });
    };
    hideEndTimePicker = () => {
        this.setState({ isEndTimePickerVisible: false });
    };
    hideFromDatePicker = () => {
        this.setState({ isFromDatePickerVisible: false });
    };
    hideToDatePicker = () => {
        this.setState({ isToDatePickerVisible: false });
    };

    getDateArray(from, to){
        var arr = [];
        var from = new Date(from);
        var to = new Date(to);
        
        while (from <= to) {
            arr.push(new Date(from));
            from.setDate(from.getDate() + 1);
        }
        return arr;
    }
    handleUpdateEvent(){
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
        this.props.delete(this.props.data.id);
        
        for(let i=0; i<dateArray.length; i++){
            let fromDate = dateArray[i].toString()+ " " +this.state.start;
            let toDate = dateArray[i].toString()+ " " +this.state.end;

            this.props.add(this.state.id, this.state.fromDate, this.state.toDate, fromDate, toDate, this.state.title, this.state.summary)
        }

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
                        <CardItem style={{borderBottomColor: 'lightgrey', borderBottomWidth: 1}}>
                            <Grid>
                                <Col size={90}>
                                    <TextInput placeholder="Event Title" name="title"
                                        onChangeText={this.handleEventHeadingChange}
                                        ref={(input)=> this.getTitle = input}
                                        value={this.state.title}
                                        style={{fontSize: 20, color:'#E7516F', padding: 0, fontWeight: 'bold',}} />
                                </Col>
                            </Grid>
                        </CardItem>
                        <Textarea ref={(input)=>this.getDescription = input}
                            rowSpan={5} name="description" 
                            onChangeText={this.handleEventDescriptionChange}
                            style={{color:'#E7516F'}}
                            value={this.state.summary}
                            placeholder="Event" style={{fontSize: 16}} />
                        <CardItem style={{borderTopColor: 'lightgrey', borderTopWidth: 1}}>
                            <Grid>
                                <Col size={10}>
                                    <View style={{flex: 1,alignItems: 'flex-start'}}>
                                        <Icon name="calendar" size={30} style={{color:'#686767', top:4 }} />
                                    </View>
                                </Col>
                                <Col size={45} style={{borderRightColor: 'lightgrey', borderRightWidth: 1,}}>
                                    <Row size={50}>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                                            <TouchableOpacity block onPress={this.showFromDatePicker}>
                                                {/* <Icon name="calendar" size={32} style={{color: 'blue', top: 7}} />                                                 */}
                                                <Text style={{textAlign: 'center', fontSize: 20, color:'#686767'}}>{this.state.fromDate}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Row>
                                    <Row size={50}>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                                            <TouchableOpacity block onPress={this.showToDatePicker}>
                                                {/* <Icon name="calendar" size={32} style={{color: 'blue', top: 7}} />                                                 */}
                                                <Text style={{textAlign: 'center', fontSize: 20, color:'#686767'}}>{this.state.toDate}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Row>
                                </Col>
                                <Col size={10}>
                                    <View style={{flex: 1,alignItems: 'flex-start'}}>
                                        <Icon name="clock" size={30} style={{color:'#686767', top:4, left: 3 }} />
                                    </View>
                                </Col>
                                <Col size={35}>
                                    <Row size={50}>
                                        <View style={{flex: 1, alignItems: 'center',}}>
                                            <TouchableOpacity block onPress={this.showStartTimePicker}>
                                                {/* <Icon name="clock" size={32} style={{left: 2, color: 'blue', top: 7}} /> */}
                                                <Text style={{ fontSize: 20, color:'#686767'}}>{this.state.start}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Row>
                                    <Row size={50}>
                                        <View style={{flex: 1, alignItems: 'center',}}>
                                            <TouchableOpacity block onPress={this.showEndTimePicker}>
                                                {/* <Icon name="clock" size={32} style={{left: 2, color: 'blue', top: 7}} /> */}
                                                {this.state.isErrorEndTime
                                                    ? <Text style={{fontSize: 18, color:'red'}}>{this.state.end}</Text>
                                                    : <Text style={{fontSize: 20, color:'#686767'}}>{this.state.end}</Text>
                                                }
                                            </TouchableOpacity>
                                            
                                            {/* <Text style={{fontWeight:'bold', paddingLeft: 4, fontSize: 28, color:'#FF9A00'}}>{this.state.end}</Text> */}
                                        </View>
                                    </Row>
                                </Col>
                            </Grid>
                            <DateTimePicker mode="time" is24Hour={false}
                                isVisible={this.state.isStartTimePickerVisible}
                                onConfirm={this.handleStartTimePicked}
                                onCancel={this.hideStartTimePicker} />
                            <DateTimePicker mode="time" is24Hour={false}
                                isVisible={this.state.isEndTimePickerVisible}
                                onConfirm={this.handleEndTimePicked}
                                onCancel={this.hideEndTimePicker} />
                            <DateTimePicker mode="date" is24Hour={false}
                                isVisible={this.state.isFromDatePickerVisible}
                                onConfirm={this.handleFromDatePicked}
                                onCancel={this.hideFromDatePicker} />
                            <DateTimePicker mode="date" is24Hour={false}
                                isVisible={this.state.isToDatePickerVisible}
                                onConfirm={this.handleToDatePicked}
                                onCancel={this.hideToDatePicker} />
                        </CardItem>
                        <Button block onPress={() => this.handleUpdateEvent()} >
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
        add: (id, fromDate, toDate, startTime, endTime, title, summary) => {   
            dispatch(addEvent(id, fromDate, toDate, startTime, endTime, title, summary))
        },
        update: (id, toDate, fromDate, start, end, title, summary) => {   
            dispatch(updateEvent(id, toDate, fromDate, start, end, title, summary))
        },
        delete: id => {
            dispatch(deleteEvent(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditFormScreen)