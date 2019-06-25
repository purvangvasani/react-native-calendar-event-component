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
            hour: this.props.data.hour,
            heading: this.props.data.heading,
            description: this.props.data.description,
        };
    };
    
    state={
        title: '',
        hour: '',
        heading: '',
        description: '',
        isDateTimePickerVisible: false,
        isModalVisible: true
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };
     
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };
     
    handleDatePicked = (date) => {
        let time = date.toString()
        time = time.substr(15,6)
        this.setState({
            hour: time
        })
        this.hideDateTimePicker();
    };

    handleUpdateEvent(){
        this.props.update(this.props.event.length, this.state.title, this.state.hour, this.state.heading, this.state.description)
        this.props.callback(this.props.visible);
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
                        <View style={{flexDirection: 'row',}}>
                            {/* <Icon name="chevron-left" size={40} style={{color: 'grey'}}/> */}
                            <Text style={{color: 'grey', fontSize: 17,left: 7, top: 4, fontWeight:'bold'}}>Event no. {this.state.id} Details</Text>
                        </View>
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
                                        value={this.state.heading}
                                        style={{fontSize: 20, color:'#E7516F', fontWeight: 'bold',}} />
                                </Col>
                            </Grid>
                        </CardItem>
                        <Textarea ref={(input)=>this.getDescription = input}
                            rowSpan={5} name="description" 
                            onChangeText={this.handleEventDescriptionChange}
                            style={{color:'#E7516F'}}
                            value={this.state.description}
                            placeholder="Event" style={{fontSize: 18}} />
                        <CardItem style={{borderTopColor: 'grey', borderTopWidth: 1}}>
                            <Grid>
                                <Col size={60}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon name="calendar" size={32} style={{color: '#FF9A00', top: 7}} />                                                
                                        <Text style={{left: 2, fontWeight:'bold', textAlign: 'center', fontSize: 28, color:'#FF9A00'}}>{this.state.title}</Text>
                                    </View>
                                </Col>
                                <Col size={35} style={{borderLeftWidth: 1, borderLeftColor: 'grey',}}>
                                    <View style={{flexDirection: 'row',}}>
                                        <TouchableOpacity block onPress={this.showDateTimePicker}>
                                            <Icon name="clock" size={32} style={{left: 2, color: 'blue', top: 7}} />
                                        </TouchableOpacity>
                                        <Text style={{fontWeight:'bold', paddingLeft: 4, fontSize: 28, color:'#FF9A00'}}>{this.state.hour}</Text>
                                    </View>
                                </Col>
                                <DateTimePicker mode="time" is24Hour={false}
                                    isVisible={this.state.isDateTimePickerVisible}
                                    onConfirm={this.handleDatePicked}
                                    onCancel={this.hideDateTimePicker}
                                />
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
        update: (id, title, hour, heading, description) => {   
            dispatch(updateEvent(id, title, hour, heading, description))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditFormScreen)