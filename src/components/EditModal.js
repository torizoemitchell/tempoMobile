import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert, StyleSheet, Switch, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { Button } from 'native-base'

export default class EditModal extends Component {

    state = {
        flow: this.props.selectedDay.flow,
        temp: this.props.selectedDay.temp,
    }

    // componentDidMount = () => {
    //     this.setState({
    //         flow: this.props.selectedDay.flow,
    //         temp: this.props.selectedDay.temp
    //     })
    // }

    displayDate = (date) => {
        let dateObject = new Date(date + 'T00:00:00-07:00')
        return dateObject.toString().substring(0, 15)
    }

    toggleFlow = () => {
        this.setState({
            ...this.state,
            flow: !this.state.flow
        })
    }

    render() {
        const {date} = this.props.selectedDay
        console.log("this.props.selectedDay", this.props.selectedDay)
        console.log("this.state. ", this.state)
        return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.props.visible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.modalContainer}>
                    <Icon name='ios-calendar' size={110} />
                    <View style={styles.dateContainer}>
                        <Text style={styles.date}>{this.displayDate(date)}</Text>
                    </View>
                    <View style={styles.inputFields}>
                        <Text style={styles.statusInfo}>Temp: </Text>
                        <TextInput placeholder={this.props.selectedDay.temp} value={this.state.temp} style={styles.input} onChangeText={(text) => { this.setState({ ...this.state, temp: text }) }} />
                    </View>
                    <View style={styles.inputFields}>
                        <Text style={styles.statusInfo}>Menstruating: No </Text>
                        <Switch value={this.state.flow} onValueChange={this.toggleFlow}/>
                        <Text style={styles.statusInfo}> Yes</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button block light onPress={this.loginHandler} style={styles.button}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </Button>
                        <Button block light onPress={this.signUpHandler} style={styles.button}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </Button>
                        <Button block light onPress={this.props.closeEditModal} style={styles.button}>
                            <Text style={styles.buttonText}>Close</Text>
                        </Button>
                        
                    </View>
                </View>

            </Modal>
        );
    }

}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    buttonContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        margin: 20
    },
    buttonText: {
        fontFamily: "HelveticaNeue",
        color: "midnightblue",
        fontSize: 20,
    },
    deleteButtonText: {
        fontFamily: "HelveticaNeue",
        color: "red",
        fontSize: 20,
    },
    button: {
        margin: 2,
        width: "30%"
    },
    dateContainer: {
        marginBottom: 35,
    },
    date: {
        fontSize: 35,
        fontFamily: "HelveticaNeue-Light"
    },
    statusInfo: {
        fontSize: 24,
        fontFamily: "HelveticaNeue-Light"
    },
    inputFields: {
        flexDirection: "row",
        padding: 5,
        alignItems: "center"

    },
    input: {
        width: "30%",
        borderColor: "grey",
        borderWidth: 1,
        padding: 10,
        margin: 8,
        fontFamily: "HelveticaNeue-Light",
        fontSize: 20
    },
})