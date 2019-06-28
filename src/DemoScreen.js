import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import EventCalendar from 'react-native-events-calendar'
import { Container, Text, Content, Fab, Card, CardItem, Grid, Col } from 'native-base';
import Modal from "react-native-modal";
import { deleteEvent } from "../actions/events";
import FormScreen from "./Form";
import EditFormScreen from "./editForm";
import Icon from "react-native-vector-icons/FontAwesome5";
import { connect } from 'react-redux';

let { width } = Dimensions.get('window')

class DemoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            start: '',
            end: '',
            title: '',
            summary: '',
            date:'',
            isModalVisible: false,
            editModalVisible: false,
            viewModalVisible: false,
            result: "",
        };
    }

    getAddModalResponse(isModalVisible) {
        this.setState({
            isModalVisible
        });
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
        this.props.delete(value);
        this.setState({
            viewModalVisible: !this.state.viewModalVisible,
        })
    };
    handleViewEvent = (value) => {
        this.setState({ viewModalVisible: true, result: value});
        let date = value.start.substr(0,10)
        let start = value.start.substr(11,8)
        let end = value.end.substr(11,8)

        this.state.start = start
        this.state.end = end
    };
    handleUpdateEvent = (value) => {
        this.setState({ viewModalVisible: !this.state.viewModalVisible, editModalVisible: true });
    };
   
    eventClicked(event) {
        //On Click oC a event showing alert from here
        this.handleViewEvent(event);
    }
    
    render() {
        return (
            <View style={{ flex: 1, marginTop: 20 }}>
                <EventCalendar
                    eventTapped={this.eventClicked.bind(this)}
                    //Function on event press
                    events={this.props.event}
                    //passing the Array of event
                    width={width}
                    //Container width
                    size={30}
                    // virtualizedListProps
                    //number of date will render before and after initDate 
                    format24h={true}
                    //(default is 30 will render 30 day before initDate and 29 day after initDate)
                    // initDate={'2019-06-27'}
                    //show initial date (default is today)
                    scrollToFirst
                    //scroll to first event of the day (default true)
                />
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
                            <TouchableOpacity onPress={this.toggleModal}>
                                <Icon name="angle-left" size={40} style={{ color: "white" }} />
                            </TouchableOpacity>
                            <FormScreen
                                date={this.state.date}
                                num={false}
                                callback={this.getAddModalResponse.bind(this)}
                            />
                        </View>
                </Modal>
                <Modal
                    style={{ marginTop: 150, paddingBottom: 195 }}
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
                                <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity onPress={this.viewToggleModal}>
                                    <Icon
                                        name="chevron-left"
                                        size={24}
                                        style={{ color: "grey" }}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        color: "grey",
                                        left: 10,
                                        fontSize: 17,
                                        top: 1,
                                        fontWeight: "bold"
                                    }}>
                                    Event on ({this.state.result.id}) Details
                                </Text>
                                <TouchableOpacity style={{ left: 120, top: 1 }} onPress={this.handleUpdateEvent}>
                                    <Icon
                                        name="edit"
                                        size={22}
                                        style={{ color: "green"}} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ left: 135, top: 1 }} onPress={this.handleDeleteEvent.bind(this, this.state.result.id)}>
                                    <Icon
                                        name="trash-alt"
                                        size={22}
                                        style={{ color: "red", }} />
                                    </TouchableOpacity>
                                </View>
                            <Card>
                                <CardItem
                                    style={{ borderBottomColor: "grey", borderBottomWidth: 1 }}>
                                    <Grid>
                                        <Col size={10}>
                                            <Icon
                                            name="link"
                                            size={24}
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
                                            <Text style={{ height: 100, color: "#E7516F" }}>
                                                {this.state.result.summary}
                                            </Text>
                                        </Col>
                                    </Grid>
                                </CardItem>
                                <CardItem
                                    style={{ borderTopColor: "grey", borderTopWidth: 1 }} >
                                    <Grid>
                                        <Col size={55}>
                                            <View style={{ flexDirection: "row" }}>
                                                <Icon
                                                    name="clock"
                                                    size={26}
                                                    style={{ color: "#FF9A00", top: 7 }}
                                                />
                                                <Text
                                                    style={{
                                                        left: 5,
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        fontSize: 28,
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
                    style={{ top: 30, marginBottom: 100 }}
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
                        <TouchableOpacity onPress={this.editToggleModal}>
                            <Icon name="chevron-left" size={24} style={{ color: "white" }} />
                        </TouchableOpacity>
                        <EditFormScreen
                            data={this.state.result}
                            visible={false}
                            callback={this.getEditModalResponse.bind(this)}
                        />
                    </View>
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

const mapStateToProps = state => {
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

export default connect(mapStateToProps, mapDispatchToProps)(DemoScreen);