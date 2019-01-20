import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert, StyleSheet, Button } from 'react-native';

export default class CalendarModal extends Component {
    render(){
        return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.props.visible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.modalContainer}>
                    <View>
                        <Text>Date: {this.props.selectedDay.date}</Text>
                        <Text>Flow: {this.props.selectedDay.flow ? "true" : "false"}</Text>
                        <Text>Temp: {this.props.selectedDay.temp}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Edit" onPress={this.loginHandler} color="midnightblue" fontFamily="HelveticaNeue-UltraLight" />
                        <Button title="Close" onPress={this.signUpHandler} color="midnightblue" fontFamily="HelveticaNeue-UltraLight" />
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
        alignItems: "center"
    },
})