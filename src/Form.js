import React, { Component } from 'react';
import { Container, Content, Form, Item, Label, Input, Button, Text, Textarea, Grid, Row, Col, Card, CardItem } from 'native-base';
import {connect} from 'react-redux'
import DateTimePicker from "react-native-modal-datetime-picker";
import {addSubEvent, addEvent} from '../actions/events'
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons'

class FormScreen extends Component {
    state={
        title: '',
        hour: '',
        date: '',
        heading: '',
        description: '',
        isTimePickerVisible: false,
        isDatePickerVisible: false
    }

    showTimePicker = () => {
        this.setState({ isTimePickerVisible: true });
    };
    showDatePicker = () => {
        this.setState({ isDatePickerVisible: true });
    };
     
    hideTimePicker = () => {
        this.setState({ isTimePickerVisible: false });
    };
    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };
     
    handleTimePicked = (date) => {
        let time = date.toString()
        time = time.substr(15,6)
        this.setState({
            hour: time
        })
        this.hideTimePicker();
    };
    
    handleDatePicked = (value) => {
        let datetime = value.toString()
        let day = datetime.substr(8,2)
        let month = datetime.substr(4,3)
        let year = datetime.substr(11,4)
        datetime = year+"-"+month+"-"+day
        this.setState({
            date: datetime
        })
        this.hideDatePicker();
    };

    handleSaveEvent(){
        let flag = 0;
        if(this.props.event.length <=0){
            this.props.add(this.props.event.length, this.props.date, this.state.hour, this.state.heading, this.state.description)
        }else{
            for(let i=0; i< this.props.event.length; i++){
                if(this.props.date === this.props.event[i].title)
                {
                    flag = 1
                    // this.props.addSub(this.props.event[i].data.length, this.props.date, this.state.hour, this.state.heading, this.state.description)
                }
                // else{
                //     this.props.add(this.props.event.length, this.props.date, this.state.hour, this.state.heading, this.state.description)
                // }
            }
        }
        if(flag == 1){
            this.props.addSub(this.props.event.length, this.props.date, this.state.hour, this.state.heading, this.state.description)
        }
        else{
            this.props.add(this.props.event.length, this.props.date, this.state.hour, this.state.heading, this.state.description)
        }
        this.props.callback(this.props.num);
    }
    
    handleEventDescriptionChange=(value)=>{
        this.setState({
            description: value,
        })
    }
    handleEventHeadingChange=(value)=>{
        this.setState({
            heading: value
        })
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
                                    <Input placeholder="Event Title" name="title"
                                        onChangeText={this.handleEventHeadingChange}
                                        ref={(input)=> this.getTitle = input}
                                        style={{fontSize: 20, color:'#E7516F', fontWeight: 'bold',}} />
                                </Col>
                            </Grid>
                        </CardItem>
                        <Textarea ref={(input)=>this.getDescription = input}
                            rowSpan={5} name="description" 
                            onChangeText={this.handleEventDescriptionChange}
                            style={{color:'#E7516F'}}
                            placeholder="Event" style={{fontSize: 18}} />
                        <CardItem style={{borderTopColor: 'grey', borderTopWidth: 1}}>
                            <Grid>
                                <Col size={65}>
                                    <View style={{flexDirection: 'row', left: 0}}>
                                        {/* <TouchableOpacity block onPress={this.showDatePicker}> */}
                                            <Icon name="calendar" size={32} style={{color: '#FF9A00', top: 8}} />                                                
                                        {/* </TouchableOpacity> */}
                                        <Text style={{left: 0, fontWeight:'bold', textAlign: 'center', fontSize: 28, color:'#FF9A00'}}>{this.props.date}</Text>
                                    </View>
                                </Col>
                                <Col size={35} style={{borderLeftWidth: 1, borderLeftColor: 'grey',}}>
                                    <View style={{flexDirection: 'row',}}>
                                        <TouchableOpacity block onPress={this.showTimePicker}>
                                            <Icon name="clock" size={32} style={{left: 2, color: 'blue', top: 8}} />
                                        </TouchableOpacity>
                                        <Text style={{fontWeight:'bold', left: 2, fontSize: 28, color:'#FF9A00'}}>{this.state.hour}</Text>
                                    </View>
                                </Col>
                                <DateTimePicker mode="time" is24Hour={false}
                                    isVisible={this.state.isTimePickerVisible}
                                    onConfirm={this.handleTimePicked}
                                    onCancel={this.hideTimePicker}
                                />
                                <DateTimePicker mode="date" is24Hour={false}
                                    isVisible={this.state.isDatePickerVisible}
                                    onConfirm={this.handleDatePicked}
                                    onCancel={this.hideDatePicker}
                                />
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
        addSub: (id, title, hour, heading, description) => {   
            dispatch(addSubEvent(id, title, hour, heading, description))
        },
        add: (id, title, hour, heading, description) => {   
            dispatch(addEvent(id, title, hour, heading, description))
        }
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(FormScreen)