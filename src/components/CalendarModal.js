import React, { Component } from 'react';
import { Modal, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import EditAnotherDayModal from './EditAnotherDayModal'
import { Button } from 'native-base'

export default class CalendarModal extends Component {


    state = {
        editModalVisible: false,
        hasBeenEdited: false,
        // flow: this.props.selectedDay.flow,
        // temp: this.props.selectedDay.temp,
        
    }

    componentWillUnmount = () =>{
        console.log("UNMOUNTED")
    }

    displayDate = (date) => {
        let dateObject = new Date(date + 'T00:00:00-07:00')
        return dateObject.toString().substring(0,15)
    }

    showEditModal = () => {
        this.setState({
            ...this.state,
            editModalVisible: true,
        })
    }

    closeEditModal = () => {
        this.setState({
            ...this.state,
            editModalVisible: false,
        })
    }

    updateAnotherEntryOnEdit = (newEntryData) => {
        let newFlow = newEntryData.flow
        let newTemp = newEntryData.temp
        this.setState({
            ...this.state,
            hasBeenEdited: true,
            temp: newTemp,
            flow: newFlow
        })
        this.closeEditModal()
        //this.props.updateAnotherEntryOnEdit()
        
    }

    closeThisModal = () => {
        this.setState({
            ...this.state,
            hasBeenEdited: false
        })
        this.props.closeModal()
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
            >
                <View style={styles.modalContainer}>

                    <Icon name='ios-calendar' size={110} />

                    <View style={styles.dateContainer}>
                        <Text style={styles.date}>{this.displayDate(date)}</Text>
                    </View>

                    <View>
                        <View style={styles.tempContainer}>
                            <Text style={styles.statusInfo}>Temp(F): </Text>
                            <Text style={styles.tempInput}>
                                {this.state.hasBeenEdited ? this.state.temp : this.props.selectedDay.temp}
                            </Text>
                        </View>

                        <View style={styles.tempContainer}>
                            <Text style={styles.statusInfo}>Menstruating: </Text>
                            <Text style={styles.flowInput}>
                                {this.state.hasBeenEdited ? (this.state.flow ? "Yes" : "No") : (this.props.selectedDay.flow ? "Yes" : "No")}
                            </Text>
                        </View>

                    </View>

                    <View style={styles.buttonContainer}>

                        <Button block light onPress={this.showEditModal} style={styles.button}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </Button>

                        <Button block light onPress={this.closeThisModal} style={styles.button}>
                            <Text style={styles.buttonText}>Close</Text>
                        </Button>

                    </View>

                </View>

                <EditAnotherDayModal 
                    visible={this.state.editModalVisible} 
                    selectedDay={this.props.selectedDay} 
                    closeEditModal={this.closeEditModal} 
                    updateAnotherEntryOnEdit={this.updateAnotherEntryOnEdit} 
                />

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
        width: "78%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    buttonText: {
        fontFamily: "HelveticaNeue",
        color: "midnightblue",
        fontSize: 16,
    },
    button: {
        margin: 2,
        width: "50%"
    },
    dateContainer: {
        marginBottom: 35,
    },
    date: {
        fontSize: 20,
        fontFamily: "HelveticaNeue-Light"
    },
    statusInfo: {
        fontSize: 16,
        fontFamily: "HelveticaNeue-Light"
    },
    tempInput: {
        width: "25%",
        // borderColor: "grey",
        // borderWidth: 1,
        padding: 10,
        margin: 3,
        fontFamily: "HelveticaNeue-Light",
        fontSize: 16,
        //textDecorationLine: "underline",
    },
    tempContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    flowInput: {
        width: "35%",
        // borderColor: "grey",
        // borderWidth: 1,
        padding: 10,
        margin: 3,
        fontFamily: "HelveticaNeue-Light",
        fontSize: 16,
        //textDecorationLine: "underline"
    }
})