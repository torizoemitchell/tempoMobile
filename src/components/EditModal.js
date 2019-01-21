import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert, StyleSheet, Button, Switch, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

export default class EditModal extends Component {

    state = {
        flow: this.props.selectedDay.flow,
        temp: this.props.selectedDay.temp,
    }

    componentDidMount = () => {

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
        const {
            date,
            flow,
            temp
        } = this.props.selectedDay
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
                            <Text style={styles.statusInfo}>Menstruating: No </Text>
                            <Switch value={this.state.flow} onValueChange={this.toggleFlow}/>
                            <Text style={styles.statusInfo}> Yes</Text>
                        </View>
                        <View style={styles.inputFields}>
                            <Text style={styles.statusInfo}>Temp: </Text>
                            <TextInput value={this.state.temp} style={styles.input}/>
                        </View>
                        
                    
                    <View style={styles.buttonContainer}>
                        <Button title="Submit" onPress={this.loginHandler} color="midnightblue" fontFamily="HelveticaNeue-UltraLight" />
                        <Button title="Cancel" onPress={this.closeModal} color="red" fontFamily="HelveticaNeue-UltraLight" />
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
    },
    input: {
        width: "30%",
        borderColor: "grey",
        borderWidth: 1,
        padding: 10,
        margin: 8,
    },
})