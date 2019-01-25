import React from 'react';
import { Text, View, TextInput } from 'react-native';
import { Button } from 'native-base'
import EditTodayModal from './EditTodayModal'

export default class TodaysEntry extends React.Component {

    state = {
        editModalVisible: false,
    }

    tempExists = (props) => {
        return(
            <View>

                <View style={this.styles.container}>

                    <View style={this.styles.tempContainer}>
                        <Text style={this.styles.text}>Temp (F): </Text>
                        <Text style={this.styles.tempInput}>
                            {props.temp}
                        </Text>
                    </View>
                    
                    <View style={this.styles.tempContainer}>
                        <Text style={this.styles.text}>Menstruating: </Text>
                        <Text style={this.styles.flowInput}>
                            {props.flow ? "Yes" : "No"}
                        </Text>
                    </View>
                    
                </View> 

                <View style={this.styles.buttonContainer}>
                    <Button small block light onPress={this.showEditModal}>
                        <Text style={this.styles.buttonText}>Edit</Text>
                    </Button>
                </View>

            </View>
        )
    }

    //if the temp does not exist, display a reminder and an input box to optionally put in the temperature manually. 
    tempDoesNotExist = () => {
        return(
            <View>
                <Text>Please record your Temperature for today.</Text>
            </View>
        )
    }

    closeEditModal = () => {
        console.log("close Edit Modal")
        this.setState({
            editModalVisible: false,
        })
    }

    showEditModal = () => {
        this.setState({
            editModalVisible: true,
        })
    }

    updateTodaysEntryOnEdit = () => {
        this.closeEditModal()
        this.props.updateTodaysEntryOnEdit()
    }

    render(){
        const {
            flow,
            temp
        } = this.props.entry
        
        return (
            <View>

                {(temp != null) ? this.tempExists(this.props.entry) : this.tempDoesNotExist()}

                <EditTodayModal 
                    visible={this.state.editModalVisible} 
                    closeEditModal={this.closeEditModal} 
                    selectedDay={this.props.entry} 
                    updateTodaysEntryOnEdit={this.updateTodaysEntryOnEdit}
                />

            </View>
        )
    }

    styles = {
        text: {
            fontSize: 16,
            fontFamily: "HelveticaNeue-Light"
        },
        container: {
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
        buttonText: {
            fontFamily: "HelveticaNeue",
            color: "midnightblue",
            fontSize: 16,
        },
        tempInput: {
            width: "50%",
            borderColor: "grey",
            borderWidth: 1,
            padding: 4,
            margin: 2,
            fontFamily: "HelveticaNeue-Light",
            fontSize: 15
        },
        flowInput: {
            width: "38%",
            borderColor: "grey",
            borderWidth: 1,
            padding: 4,
            margin: 2,
            fontFamily: "HelveticaNeue-Light",
            fontSize: 15
        },
        tempContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        },
        buttonContainer: {
            margin: 5
        }

    }
}





