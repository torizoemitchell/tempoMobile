import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert, StyleSheet, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import EditModal from './EditModal'

export default class CalendarModal extends Component {

    state = {
        editModalVisible: false,
    }

    displayDate = (date) => {
        let dateObject = new Date(date + 'T00:00:00-07:00')
        return dateObject.toString().substring(0,15)
    }

    showEditModal = () => {
        this.setState({
            editModalVisible: true,
        })
    }

    closeEditModal = () => {
        console.log("close Edit Modal")
        this.setState({
            editModalVisible: false,
        })
    }

    render(){
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
                    <View>
                        <Text style={styles.statusInfo}>Menstruating: {flow ? "Yes" : "No"}</Text>
                        <Text style={styles.statusInfo}>Temp: {temp}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Edit" onPress={this.showEditModal} color="midnightblue" fontFamily="HelveticaNeue-UltraLight" />
                        <Button title="Close" onPress={this.props.closeModal} color="midnightblue" fontFamily="HelveticaNeue-UltraLight" />
                    </View>
                </View>
                <EditModal visible={this.state.editModalVisible} selectedDay={this.props.selectedDay} closeEditModal={this.closeEditModal}/>
                
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
    }
})