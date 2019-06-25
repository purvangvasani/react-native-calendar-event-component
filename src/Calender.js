import _ from 'lodash';
import React, { Component } from 'react'
import {
    Platform,
    Alert,
    StyleSheet,
    View,
    TouchableOpacity
  } from 'react-native';
import {ExpandableCalendar, AgendaList, CalendarProvider, Agenda} from 'react-native-calendars';
import { Text, Container, Content, Grid, Col, Card, CardItem } from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons'
import { connect } from 'react-redux';
import FormScreen from './Form'
import Modal from 'react-native-modal'
import { deleteEvent, updateEvent } from '../actions/events';
import EditFormScreen from './editForm';
import AsyncStorage from '@react-native-community/async-storage';

const today = new Date().toISOString().split('T')[0];
const fastDate = getPastDate(3); 
const futureDates = getFutureDates(9);
const dates = [fastDate, today].concat(futureDates);

function getFutureDates(days) {
  const array = [];
  for (let index = 1; index <= days; index++) {
    const date = new Date(Date.now() + (864e5 * index));
    const dateString = date.toISOString().split('T')[0];
    array.push(dateString);
  }
  return array;
}

function getPastDate(days) {
    return new Date(Date.now() - (864e5 * days)).toISOString().split('T')[0];
}

class CalenderScreen extends Component {

    componentDidMount() {
        const { navigation } = this.props;
        subscribe = navigation.addListener("didFocus", () => {
            this.setState({
                ITEM: [...this.props.event]
            }) 
        });
        AsyncStorage.getItem('event').then((data)=>{
            this.state.data = JSON.parse(data);
        })

    }
     
    state={
        ITEM: [],
        active: false,
        isModalVisible: false,
        viewModalVisible: false,
        editModalVisible: false,
        date: '',
        result: '',
        data: ''
    }

    onDateChanged = (date /**, updateSource*/) => {
        this.setState({
            date: date,
            isModalVisible: true
        })
    }
      
    buttonPressed() {
        Alert.alert('show more');
    }
        
    renderEmptyItem() {
        return (
            <View style={styles.emptyItem}>
                <Text style={styles.emptyItemText}>No Events Planned</Text>
            </View>
        );
    }

    getAddModalResponse(isModalVisible){
        this.setState({isModalVisible});
    }

    getEditModalResponse(editModalVisible){
        this.setState({editModalVisible});
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    viewToggleModal = () => {
        this.setState({ viewModalVisible: !this.state.viewModalVisible });
    }

    editToggleModal = () => {
        this.setState({ editModalVisible: !this.state.editModalVisible });
    }

    handleDeleteEvent = (value) => {
        this.props.delete(value)
    }

    handleUpdateEvent = (value) => {
        this.setState({editModalVisible: true, result: value})
        // this.props.navigation.navigate('EditEvent', {value: value})
    }

    handleViewEvent = (value) => {
        this.setState({viewModalVisible: true, result: value})
    }

    renderItem = ({item}) => {
        return (
            <Grid style={{padding:10}}>
                <Col size={12}>
                    <Text style={{color: '#FF9A00'}}>{item.hour}</Text>
                </Col>
                <Col size={67}>
                    <Text style={[styles.itemTitleText, {color: '#E7516F'}]}>{item.heading}</Text>
                </Col>
                <Col size={21}>
                    <View style={{flexDirection: 'row',}}>
                        <TouchableOpacity style={{ backgroundColor: 'white' }} onPress={(this.handleViewEvent.bind(this, item))}>
                            <Icon name="eye" size={30} style={{color: 'green', fontWeight: 'bold'}} />
                        </TouchableOpacity> 
                        <TouchableOpacity style={{ backgroundColor: 'white' }} onPress={(this.handleUpdateEvent.bind(this, item))}>
                            <Icon name="pencil" size={30} style={{color: '#3B5998', fontWeight: 'bold'}} />
                        </TouchableOpacity>    
                        <TouchableOpacity style={{ backgroundColor: 'white' }} onPress={(this.handleDeleteEvent.bind(this, item.title))}>
                            <Icon name="trash" size={30} style={{color: '#DD5144', fontWeight: 'bold'}} />
                        </TouchableOpacity>
                    </View>
                </Col>
            </Grid>
        );
    }
    
    getMarkedDates = () => {
        const marked = {};
        let ITEMS = [...this.props.event]
        ITEMS.forEach(item => {
            // only mark dates with data
            if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
                marked[item.title] = {marked: true};
            }
        });
        return marked;
    }
    
    renderEmptyDate() {
        return (
          <View style={styles.emptyDate}>
            <Text>This is empty date!</Text>
          </View>
        );
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
    
    render() {  
        let ITEMS = [...this.props.event]
        return (
            <Container>
                <CalendarProvider date={ITEMS[0].title} onDateChanged={this.onDateChanged} theme={{todayButtonTextColor: '#0059ff'}} showTodayButton>
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
                        leftArrowImageSource={require('../src/img/previous.png')}
                        rightArrowImageSource={require('../src/img/next.png')}
                        headerStyle={styles.calendar}
                    />
                    <AgendaList
                        sections={ITEMS}
                        extraData={this.state}
                        renderItem={this.renderItem}
                    />
                </CalendarProvider>
                <Modal
                    isVisible={this.state.isModalVisible}
                    backdropColor="grey"
                    backdropOpacity={1}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={(this.toggleModal)}>
                            <Icon name="close" size={40} style={{color: 'white'}}/>
                        </TouchableOpacity>
                        <FormScreen date={this.state.date} num={false} callback={this.getAddModalResponse.bind(this)} />
                    </View>
                </Modal>
                <Modal  style={{ top: 30, marginBottom: 100,}}
                    isVisible={this.state.editModalVisible}
                    backdropColor="grey"
                    backdropOpacity={1}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={(this.editToggleModal)}>
                            <Icon name="close" size={40} style={{color: 'white'}}/>
                        </TouchableOpacity>
                        <EditFormScreen data={this.state.result} visible={false} callback={this.getEditModalResponse.bind(this)}/>
                    </View>
                </Modal>
                <Modal style={{ marginTop: 150, paddingBottom: 150,}}
                    isVisible={this.state.viewModalVisible}
                    backdropColor="grey"
                    backdropOpacity={1}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}>
                    <View style={{ flex: 1 }}>
                        <Container>
                            <Content padder>
                                <TouchableOpacity onPress={(this.viewToggleModal)}>
                                    <View style={{flexDirection: 'row',}}>
                                        <Icon name="chevron-left" size={40} style={{color: 'grey'}}/>
                                        <Text style={{color: 'grey', fontSize: 17, top: 4, fontWeight:'bold'}}>Event no. {this.state.result.id} Details</Text>
                                    </View>
                                </TouchableOpacity>
                                <Card>
                                    <CardItem style={{borderBottomColor: 'grey', borderBottomWidth: 1}}>
                                        <Grid>
                                            <Col size={10}>
                                                <Icon name="link" size={30} style={{color: '#E7516F', top: 3}} />
                                            </Col>
                                            <Col size={90}>
                                                <Text style={{fontSize: 20, color:'#E7516F', fontWeight: 'bold',}}>
                                                    {this.state.result.heading}
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
                                                <Text style={{height: 100, color:'#E7516F'}}>{this.state.result.description}</Text>
                                            </Col>
                                        </Grid>
                                    </CardItem>
                                    <CardItem style={{borderTopColor: 'grey', borderTopWidth: 1}}>
                                        <Grid>
                                            <Col size={60}>
                                                <View style={{flexDirection: 'row'}}>
                                                    <Icon name="calendar" size={32} style={{color: '#FF9A00', top: 7}} />                                                
                                                    <Text style={{left: 5, fontWeight:'bold', textAlign: 'center', fontSize: 28, color:'#FF9A00'}}>{this.state.result.title}</Text>
                                                </View>
                                            </Col>
                                            <Col size={35} style={{borderLeftWidth: 1, borderLeftColor: 'grey',}}>
                                                <View style={{flexDirection: 'row',}}>
                                                    <Icon name="clock" size={32} style={{left: 2, color: '#FF9A00', top: 7}} />
                                                    <Text style={{fontWeight:'bold', paddingLeft: 4, fontSize: 28, color:'#FF9A00'}}>{this.state.result.hour}</Text>
                                                </View>
                                            </Col>
                                        </Grid>
                                    </CardItem>
                                </Card>
                            </Content>
                        </Container>
                    </View>
                </Modal>
            </Container> 
        );
    }
}
    
const styles = StyleSheet.create({
    calendar: {
        paddingLeft: 20, 
        paddingRight: 20
    },
    section: {
        backgroundColor: '#f0f4f7', 
        color: '#79838a'
    },
    item: {
        padding: 20, 
        backgroundColor: 'white', 
        borderBottomWidth: 1, 
        borderBottomColor: '#e8ecf0', 
        flexDirection: 'row'
    },
    itemDurationText: {
        color: 'grey', 
        fontSize: 12, 
        marginTop: 4,
        marginLeft: 4
    },
    itemTitleText: {
        color: 'black', 
        marginLeft: 16, 
        fontWeight: 'bold', 
        fontSize: 16
    },
    emptyDate: {
        height: 15,
        flex:1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
    },
    itemButtonContainer: {
        flex: 1, 
        alignItems: 'flex-end'
    },
    emptyItem: {
        paddingLeft: 20,
        height: 52, 
        justifyContent: 'center',
        borderBottomWidth: 1, 
        borderBottomColor: '#e8ecf0' 
    },
    emptyItemText: {
        color: '#79838a',
        fontSize: 14
    }
});

const mapStateToProps = state => {
    AsyncStorage.setItem('event', JSON.stringify(state.event.events))
    return {
        event: state.event.events
    }
}

const mapDispatchToProps = dispatch => {
    return {
        delete: (title) => {   
            dispatch(deleteEvent(title))
        },
        update: (id, title, hour, heading, description) => {   
            dispatch(updateEvent(id, title, hour, heading, description))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CalenderScreen)