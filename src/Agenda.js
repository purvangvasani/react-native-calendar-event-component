import React, { Component } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Agenda } from "react-native-calendars";
import { connect } from "react-redux";
import {
  Fab,
  Container,
  Grid,
  Col,
  Content,
  Card,
  CardItem
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";
import Modal from "react-native-modal";
import FormScreen from "./Form";
import EditFormScreen from "./editForm";
import { deleteEvent } from "../actions/events";

const today = new Date().toISOString().split("T")[0];

class AgendaScreen extends Component {
  
  componentDidMount() {
    const { navigation } = this.props;
    subscribe = navigation.addListener("didFocus", () => {
      this.loadItems();
    });
  }
  
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      date: "",
      isModalVisible: false,
      viewModalVisible: false,
      editModalVisible: false,
      result: "",
      data: {}
    };
  }

  handleDeleteEvent = value => {
    console.log("====================================");
    console.log();
    console.log("====================================");
    this.props.delete(value.date);
  };

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

  onDateChanged = day => {
    this.setState({
      date: day.dateString
    });
  };

  render() {
    if (this.state.date == "") {
      this.state.date = today;
    }
    return (
      <Container>
        <Agenda
          items={this.state.items}
          onDayPress={this.onDateChanged}
          loadItemsForMonth={this.loadItems.bind(this)}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          renderEmptyData={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
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
          backdropTransitionOutTiming={600}
        >
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
          style={{ marginTop: 150, paddingBottom: 150 }}
          backdropColor="grey"
          backdropOpacity={1}
          isVisible={this.state.viewModalVisible}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
        >
          <View style={{ flex: 1 }}>
            <Container>
              <Content padder>
                <TouchableOpacity onPress={this.viewToggleModal}>
                  <View style={{ flexDirection: "row" }}>
                    <Icon
                      name="chevron-left"
                      size={24}
                      style={{ color: "grey" }}
                    />
                    <Text
                      style={{
                        color: "grey",
                        left: 10,
                        fontSize: 17,
                        top: 1,
                        fontWeight: "bold"
                      }}
                    >
                      Event no. {this.state.result.id} Details
                    </Text>
                  </View>
                </TouchableOpacity>
                <Card>
                  <CardItem
                    style={{ borderBottomColor: "grey", borderBottomWidth: 1 }}
                  >
                    <Grid>
                      <Col size={10}>
                        <Icon
                          name="link"
                          size={24}
                          style={{ color: "#E7516F", top: 3 }}
                        />
                      </Col>
                      <Col size={90}>
                        <Text
                          style={{
                            fontSize: 20,
                            color: "#E7516F",
                            fontWeight: "bold"
                          }}
                        >
                          {this.state.result.name}
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
                          {this.state.result.desc}
                        </Text>
                      </Col>
                    </Grid>
                  </CardItem>
                  <CardItem
                    style={{ borderTopColor: "grey", borderTopWidth: 1 }}
                  >
                    <Grid>
                      <Col size={55}>
                        <View style={{ flexDirection: "row" }}>
                          <Icon
                            name="calendar"
                            size={26}
                            style={{ color: "#FF9A00", top: 7 }}
                          />
                          <Text
                            style={{
                              left: 5,
                              fontWeight: "bold",
                              textAlign: "center",
                              fontSize: 28,
                              color: "#FF9A00"
                            }}
                          >
                            {this.state.result.date}
                          </Text>
                        </View>
                      </Col>
                      <Col
                        size={35}
                        style={{ borderLeftWidth: 1, borderLeftColor: "grey" }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Icon
                            name="clock"
                            size={26}
                            style={{ left: 5, color: "#FF9A00", top: 7 }}
                          />
                          <Text
                            style={{
                              fontWeight: "bold",
                              paddingLeft: 4,
                              fontSize: 28,
                              color: "#FF9A00"
                            }}
                          >
                            {this.state.result.hour}
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
          backdropTransitionOutTiming={600}
        >
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
          containerStyle={{}}
          style={{ backgroundColor: "#5067FF" }}
          position="bottomRight"
        >
          <TouchableOpacity
            onPress={() => {
              this.setState({ isModalVisible: true });
            }}
          >
            <Icon name="plus" size={22} style={{ color: "white" }} />
          </TouchableOpacity>
        </Fab>
      </Container>
    );
  }

  loadItems() {
    setTimeout(() => {
      for (let i = 0; i < this.props.event.length; i++) {
        const strTime = this.props.event[i].title;
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];

          for (let j = 0; j < this.props.event[i].data.length; j++) {
            this.state.items[strTime].push({
              name: this.props.event[i].data[j].heading,
              desc: this.props.event[i].data[j].description,
              hour: this.props.event[i].data[j].hour,
              date: this.props.event[i].title,
              id: this.props.event[i].data[j].id
            });
          }
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key];
      });
      this.setState({
        items: newItems
      });
    }, 500);
  }

  handleViewEvent = value => {
    this.setState({ viewModalVisible: true, result: value });
  };
  handleUpdateEvent = value => {
    this.setState({ editModalVisible: true, result: value });
  };

  renderItem(item) {
    return (
      <View style={[styles.item, { height: 80 }]}>
        <Grid style={{ padding: 10 }}>
          <Col size={12}>
            <Text style={{ color: "#FF9A00" }}>{item.hour}</Text>
          </Col>
          <Col size={67}>
            <Text style={[styles.itemTitleText, { color: "#E7516F" }]}>
              {item.name}
            </Text>
          </Col>
          <Col size={21}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ backgroundColor: "white" }}
                onPress={this.handleViewEvent.bind(this, item)}
              >
                <Icon
                  name="eye"
                  size={20}
                  style={{ color: "green", fontWeight: "bold" }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: "white", left: 7 }}
                onPress={this.handleUpdateEvent.bind(this, item)}
              >
                <Icon
                  name="pencil-alt"
                  size={20}
                  style={{ color: "#3B5998", fontWeight: "bold" }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: "white", left: 15 }}
                onPress={this.handleDeleteEvent.bind(this, item)}
              >
                <Icon
                  name="trash"
                  size={20}
                  style={{ color: "#DD5144", fontWeight: "bold" }}
                />
              </TouchableOpacity>
            </View>
          </Col>
        </Grid>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  itemTitleText: {
    color: "black",
    marginLeft: 16,
    fontWeight: "bold",
    fontSize: 16
  },
  emptyDate: {
    height: 15,
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  }
});

const mapStateToProps = state => {
  console.log("====================================");
  console.log(state.event.events);
  console.log("====================================");
  return {
    event: state.event.events
  };
};

const mapDispatchToProps = dispatch => {
  return {
    delete: title => {
      dispatch(deleteEvent(title));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgendaScreen);
