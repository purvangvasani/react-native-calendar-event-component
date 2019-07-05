import React, { Component } from 'react';
import { Platform, View, Dimensions, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import EventCalendar from 'react-native-events-calendar'
import { Container, Text, Content, Fab, Card, CardItem, Grid, Col } from 'native-base';
import Modal from "react-native-modal";
import { deleteEvent } from "../../../actions/events";
import AddEventScreen from "./AddEvent";
import EditEventScreen from "./EditEvent";
import Icon from "react-native-vector-icons/FontAwesome5";
import { connect } from 'react-redux';
import {ExpandableCalendar, CalendarProvider} from 'react-native-calendars';
import AsyncStorage from '@react-native-community/async-storage'
import Toast from 'react-native-simple-toast';
import firebase from 'react-native-firebase';

let date = new Date(Date.now())
let { width } = Dimensions.get('window')
let today = new Date().toISOString().split('T')[0];
let time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()

class CalendarScreen extends Component {
    
    componentDidMount() {
        // Create notification channel required for Android devices
        this.createNotificationChannel();
    
        // Ask notification permission and add notification listener
        this.checkPermission();
    }
    
    createNotificationChannel = () => {
        // Build a android notification channel
        const channel = new firebase.notifications.Android.Channel(
          'reminder',
          'Reminders Channel',
          firebase.notifications.Android.Importance.High
        ).setDescription('Used for getting reminder notification');
        // Create the android notification channel
        firebase.notifications().android.createChannel(channel);
    };

    checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.notificationListener = firebase.notifications().onNotification(async notification => {
                // Display your notification
                await firebase.notifications().displayNotification(notification);
            });
        } else {
            // user doesn't have permission
            try {
                await firebase.messaging().requestPermission();
            } catch (error) {
                Alert.alert(
                    'Unable to access the Notification permission. Please enable the Notification Permission from the settings'
                );
            }
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            day: '',
            start: '',
            end: '',
            title: '',
            summary: '',
            date: today,
            time: time,
            month: '',
            isModalVisible: false,
            editModalVisible: false,
            viewModalVisible: false,
            isDatePickerVisible: false,
            result: "",
            datetime: '',
            event: [],
        };
    }
    getAddModalResponse(isModalVisible) {
        this.setState({
            isModalVisible
        });
        // Toast.show("Added!",Toast.LONG,Toast.BOTTOM)
    }
    getEditModalResponse(editModalVisible) {
        this.setState({
            editModalVisible
        });
    }

    toggleModal = () => {
        this.setState({
            isModalVisible: !this.state.isModalVisible
        });
    };
    viewToggleModal = () => {
        this.setState({
          viewModalVisible: !this.state.viewModalVisible
        });
    };
    editToggleModal = () => {
        this.setState({
            editModalVisible: !this.state.editModalVisible
        });
    };

    handleDeleteEvent = (value) => {
        Alert.alert(
            'Sure you want to delete this event?',
            '',
            [
              {text: '', onPress: () => console.log('Ask me later pressed')},
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OK', onPress: () => this.deleteEvent(value)},
            ],
            {cancelable: false},
          );
    };
    deleteEvent=(value)=>{
        this.props.delete(value);
        this.setState({
            viewModalVisible: !this.state.viewModalVisible,
        })
        Toast.show("Deleted!",Toast.LONG,Toast.BOTTOM)
    }
    handleViewEvent = (value) => {
        this.setState({ viewModalVisible: true, result: value});
        let date = value.start.substr(0,10)
        let start = value.start.substr(11,8)
        let end = value.end.substr(11,8)
        this.state.day = date
        this.state.start = start
        this.state.end = end
    };

    handleUpdateEvent = (value) => {
        this.setState({ viewModalVisible: !this.state.viewModalVisible, editModalVisible: true });
    };
   
    eventClicked(event) {
        this.handleViewEvent(event);
    }

    getTheme = () => {
        const themeColor = '#0059ff';
        const lightThemeColor = '#e6efff';
        const disabledColor = '#a6acb1';
        const black = '#20303c';
        const white = '#ffffff';
        
        return {
            // arrows
            arrowColor: black,
            arrowStyle: {padding: 0},
            // month
            monthTextColor: black,
            textMonthFontSize: 16,
            textMonthFontFamily: 'HelveticaNeue',
            textMonthFontWeight: 'bold',
            // day names
            textSectionTitleColor: black,
            textDayHeaderFontSize: 12,
            textDayHeaderFontFamily: 'HelveticaNeue',
            textDayHeaderFontWeight: 'normal',
            // today
            todayBackgroundColor: lightThemeColor,
            todayTextColor: themeColor,
            // dates
            dayTextColor: themeColor,
            textDayFontSize: 18,
            textDayFontFamily: 'HelveticaNeue',
            textDayFontWeight: '500',
            textDayStyle: {marginTop: Platform.OS === 'android' ? 2 : 4},
            // selected date
            selectedDayBackgroundColor: themeColor,
            selectedDayTextColor: white,
            // disabled date
            textDisabledColor: disabledColor,
            // dot (marked date)
            dotColor: themeColor,
            selectedDotColor: white,
            disabledDotColor: disabledColor,
            dotStyle: {marginTop: -2}
        };
    }

    onDateChanged = (day) => {
        this.setState({
            date: ''
        }, ()=>this.setState({date: day}));
    };

    getMarkedDates = () => {
        const marked = {};
        let ITEMS = this.props.event
        
        if(ITEMS.length > 0){
            for(let i = 0;i < ITEMS.length; i++){
                let date = ITEMS[i].start.substr(0, 10).trim();
                marked[date] = {marked:true};
            }
        }
        return marked;
    }
    

    render() {
        let ITEMS = this.props.event
        return (
            <View style={{ flex: 1 }}>
                <CalendarProvider date={ITEMS.date} onDateChanged={this.onDateChanged} theme={{todayButtonTextColor: '#0059ff'}}>
                    <ExpandableCalendar 
                        // horizontal={true}
                        // hideArrows
                        // disablePan
                        // hideKnob
                        // initialPosition={'open'} // ExpandableCalendar.positions.OPEN - can't find static positions
                        firstDay={1}
                        markedDates={this.getMarkedDates()} // {'2019-06-01': {marked: true}, '2019-06-02': {marked: true}, '2019-06-03': {marked: true}};
                        calendarStyle={styles.calendar}
                        theme={this.getTheme()}
                        leftArrowImageSource={require('../../img/previous.png')}
                        rightArrowImageSource={require('../../img/next.png')}
                        headerStyle={styles.calendar}
                    />
                </CalendarProvider>
                {this.state.date ?
                <EventCalendar
                    eventTapped={this.eventClicked.bind(this)}
                    events={this.props.event}
                    width={width}
                    size={30}
                    format24h={true}
                    initDate={this.state.date}
                    scrollToFirst
                />
                : null}
                <Modal
                    isVisible={this.state.isModalVisible}
                    backdropColor="grey"
                    backdropOpacity={1}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600} >
                        <View style={{ flex: 1 }}>
                            <Container>
                                <Content padder>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <TouchableOpacity onPress={this.toggleModal}>
                                            <Icon name="angle-left" size={30} style={{ color: "grey" }} />
                                        </TouchableOpacity>
                                        <Text style={{color:'grey', top: 3, left: 5, fontWeight: 'bold'}}>Add Event</Text>
                                    </View>
                                    <AddEventScreen
                                        time={this.state.time}
                                        date={this.state.date}
                                        num={false}
                                        callback={this.getAddModalResponse.bind(this)}
                                    />
                                </Content>
                        </Container>
                    </View>
                </Modal>
                <Modal
                    backdropColor="grey"
                    backdropOpacity={1}
                    isVisible={this.state.viewModalVisible}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600} >
                    <View style={{ flex: 1 }}>
                        <Container>
                            <Content padder>
                                <View style={{ flex:1, flexDirection: "row" }}>
                                    <View style={{flexDirection: "row", flex: 2, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                                        <TouchableOpacity onPress={this.viewToggleModal}>
                                            <Icon
                                                name="angle-left"
                                                size={30}
                                                style={{ color: "grey" }}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                color: "grey",
                                                left: 5,
                                                top: 3,
                                                fontWeight: "bold"
                                            }}>
                                            Event Details
                                        </Text>
                                    </View>
                                    <View style={{flexDirection: "row", flex:3, justifyContent: 'flex-end'}}>
                                        <TouchableOpacity style={{right: 16}} onPress={this.handleUpdateEvent}>
                                            <Icon
                                                name="edit"
                                                size={22}
                                                style={{ color: "green"}} />
                                        </TouchableOpacity>
                                    
                                        <TouchableOpacity style={{right: 8}} onPress={this.handleDeleteEvent.bind(this, this.state.result.id)}>
                                            <Icon
                                            name="trash-alt"
                                            size={22}
                                            style={{ color: "red", }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Card>
                                    <CardItem
                                        style={{ borderBottomColor: "lightgrey", borderBottomWidth: 1 }}>
                                        <Grid>
                                            <Col size={10}>
                                                <Icon
                                                    name="link"
                                                    size={20}
                                                    style={{ color: "#E7516F", top: 3 }}/>      
                                            </Col>
                                            <Col size={90}>
                                                <Text
                                                    style={{
                                                    fontSize: 20,
                                                    color: "#E7516F",
                                                    fontWeight: "bold"
                                                    }}>
                                                    {this.state.result.title}
                                                </Text>
                                            </Col>
                                        </Grid>
                                    </CardItem>
                                    <CardItem>
                                        <Grid>
                                            <Col size={10}>
                                                {/* <Icon name="comment" size={30} style={{color: '#E7516F', top: 2}} /> */}
                                            </Col>
                                            <Col size={90}>
                                                <Text style={{ height: 80, color: "#E7516F" }}>
                                                    {this.state.result.summary}
                                                </Text>
                                            </Col>
                                        </Grid>
                                    </CardItem>
                                    <CardItem style={{ borderTopColor: "lightgrey", borderTopWidth: 1 }}>
                                        <Grid>
                                            <Col size={10}>
                                                <Icon name="calendar" size={20} style={{ color: "#FF9A00", top: 4 }} />
                                            </Col>
                                            <Col size={90}>
                                                <View style={{flexDirection: 'row',}}>
                                                    <Text style={{ fontWeight: "bold", fontSize: 20, color: "#FF9A00" }} >
                                                        {this.state.result.fromDate} / {this.state.result.toDate}
                                                    </Text>
                                                </View>
                                            </Col>
                                        </Grid>
                                    </CardItem>
                                    <CardItem
                                        style={{ borderTopColor: "lightgrey", borderTopWidth: 1 }} >
                                        <Grid>
                                            <Col size={55}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Icon
                                                        name="clock"
                                                        size={20}
                                                        style={{ color: "#FF9A00", top: 3 }}
                                                    />
                                                    <Text
                                                        style={{
                                                        left: 5,
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        fontSize: 20,
                                                        color: "#FF9A00" }} >
                                                        {this.state.start} - {this.state.end}
                                                    </Text>
                                                </View>
                                            </Col>
                                        </Grid>
                                    </CardItem>
                                </Card>
                            </Content>
                        </Container>
                    </View>
                </Modal>
                <Modal
                    // style={{ top: 30, marginBottom: 100 }}
                    isVisible={this.state.editModalVisible}
                    backdropColor="grey"
                    backdropOpacity={1}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600} >
                    <View style={{ flex: 1 }}>
                            <Container>
                                <Content padder>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <TouchableOpacity onPress={this.editToggleModal}>
                                            <Icon name="angle-left" size={30} style={{ color: "grey" }} />
                                        </TouchableOpacity>
                                        <Text style={{color:'grey', top: 3.5, left: 5, fontWeight: 'bold'}}>Edit Event Details</Text>
                                    </View>
                                    <EditEventScreen
                                        data={this.state.result}
                                        visible={false}
                                        callback={this.getEditModalResponse.bind(this)}
                                    />
                                </Content>
                        </Container>
                    </View>

                    {/* <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={this.editToggleModal}>
                            <Icon name="chevron-left" size={24} style={{ color: "white" }} />
                        </TouchableOpacity>
                        <EditFormScreen
                            data={this.state.result}
                            visible={false}
                            callback={this.getEditModalResponse.bind(this)}
                        />
                    </View> */}
                </Modal>
                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => {
                        this.setState({ isModalVisible: true });
                    }}>
                    <Icon name="plus" />
                </Fab>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    calendar: {
        paddingLeft: 20, 
        paddingRight: 20
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    button: {
      borderWidth: 1,
      borderColor: "#000000",
      margin: 5,
      padding: 5,
      width: "70%",
      backgroundColor: "#DDDDDD",
      borderRadius: 5,
    },
    textField: {
      borderWidth: 1,
      borderColor: "#AAAAAA",
      margin: 5,
      padding: 5,
      width: "70%"
    },
    spacer: {
      height: 10,
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center",
    }
});

const mapStateToProps = state => {
    AsyncStorage.setItem('DEMO', JSON.stringify(state.event.events))
    return {
        event: state.event.events
    }
}

const mapDispatchToProps = dispatch => {
    return {
        delete: id => {
            dispatch(deleteEvent(id));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);