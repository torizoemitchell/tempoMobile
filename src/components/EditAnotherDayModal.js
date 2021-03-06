import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert, StyleSheet, Switch, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { Button } from 'native-base'

export default class EditAnotherDayModal extends Component {

    state = {
        flow: this.props.selectedDay.flow,
        temp: this.props.selectedDay.temp
    }

    updateRequest = async () => {
        let entryId = this.props.selectedDay.id
        //check to make sure a change has been made, show an error if not.
        if (this.state.flow === undefined && this.state.temp === undefined) {
            Alert.alert('Error', 'Please enter your changes before submitting.', [{ text: 'OK' },])
            return
        }

        let requestURL = 'https://tempomobile.herokuapp.com/entries/' + `${entryId}`
        const response = await fetch(`${requestURL}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                flow: this.state.flow,
                temp: this.state.temp,
            })
        })
        const jsonResponse = await response.json()
        this.props.updateAnotherEntryOnEdit(jsonResponse)
    }

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
        const { date, id } = this.props.selectedDay
        return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.props.visible}
            >
                <View style={styles.modalContainer}>
                    <Icon name='ios-calendar' size={110} />
                    <View style={styles.dateContainer}>
                        <Text style={styles.date}>{this.displayDate(date)}</Text>
                    </View>
                    <View style={styles.inputFields}>
                        <Text style={styles.statusInfo}>Temp: </Text>
                        <TextInput value={this.state.temp === undefined ? this.props.selectedDay.temp : this.state.temp} style={styles.input} onChangeText={(text) => { this.setState({ ...this.state, temp: text }) }} />
                    </View>
                    <View style={styles.inputFields}>
                        <Text style={styles.statusInfo}>Menstruating: No </Text>
                        <Switch value={this.state.flow === undefined ? this.props.selectedDay.flow : this.state.flow} onValueChange={this.toggleFlow} />
                        <Text style={styles.statusInfo}> Yes</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button block light onPress={this.updateRequest} style={styles.button}>
                            <Text style={styles.buttonText}>Submit</Text>
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
        fontSize: 18,
    },
    deleteButtonText: {
        fontFamily: "HelveticaNeue",
        color: "red",
        fontSize: 18,
    },
    button: {
        margin: 2,
        width: "30%"
    },
    dateContainer: {
        marginBottom: 28,
    },
    date: {
        fontSize: 26,
        fontFamily: "HelveticaNeue-Light"
    },
    statusInfo: {
        fontSize: 18,
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
        fontSize: 18
    },
})