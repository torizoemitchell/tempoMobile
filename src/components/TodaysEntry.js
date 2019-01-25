import React from 'react';
import { Text, View, TextInput, Switch } from 'react-native';
import { Button } from 'native-base'
import EditTodayModal from './EditTodayModal'

export default class TodaysEntry extends React.Component {

    state = {
        editModalVisible: false,
        entryForToday: ''
    }

    postNewEntry = () => {
        console.log("post new entry")
    }

    completeEntryExists = (props) => {
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

    
    entryDoesNotExist = () => {
        return(
            <View>
                <View style={this.styles.container}>

                    <View style={this.styles.reminderContainer}>
                        <Text style={this.styles.reminderText}>Please record your entry for today.</Text>
                    </View>

                    <View style={this.styles.inputFields}>
                        <Text style={this.styles.statusInfo}>Temp: </Text>
                        <TextInput
                            value={this.state.entryForToday}
                            style={this.styles.input}
                            onChangeText={(text) => { this.setState({ ...this.state, entryForToday: text }) }} />
                    </View>

                    <View style={this.styles.inputFields}>
                        <Text style={this.styles.statusInfo}>Menstruating: No </Text>
                        <Switch
                            value={false}
                            onValueChange={console.log("toggle")}
                        />
                        <Text style={this.styles.statusInfo}> Yes</Text>
                    </View>

                </View>

                <View style={this.styles.buttonContainer}>
                    <Button small block light onPress={this.postNewEntry}>
                        <Text style={this.styles.buttonText}>Submit</Text>
                    </Button>
                </View>

            </View>
            
            
        )
    }

    getEntryFormat = (temp, flow) => {
        console.log("getting entry format")
        //if temp and flow are missing, please record your "entry" and make all text red
        console.log("temp: ", temp, "flow: ", flow)
        if(temp === undefined && flow === undefined){
            console.log("need to display form for entire entry")
            return this.entryDoesNotExist()
        }
        //if the complete entry already exists, show the data with the edit button.
        else if (temp && flow){
            console.log("entry has already been completed")
            return this.completeEntryExists()
        }

        //if temp exists but flow hasn't been recorded yet

        //if flow exists but temp hasn't been recorded yet. 
    }

    getColor = (temp, flow) => {
        if (temp === undefined && flow === undefined) {
            return "red"
        }
        //if the complete entry already exists, show the data with the edit button.
        else if (temp && flow) {
            return "black"
        }
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

                {this.getEntryFormat(temp, flow)}

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
        reminderText: {
            fontSize: 16,
            fontFamily: "HelveticaNeue-Light",
            color: this.getColor(this.props.entry.temp, this.props.entry.flow),
        },
        reminderContainer: {
            alignItems: "center",
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
            borderColor: this.getColor(this.props.entry.temp, this.props.entry.flow),
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
        },
        statusInfo: {
            fontSize: 14,
            fontFamily: "HelveticaNeue-Light",
            color: this.getColor(this.props.entry.temp, this.props.entry.flow)
        },
        inputFields: {
            flexDirection: "row",
            padding: 5,
            alignItems: "center"

        },
        input: {
            width: "30%",
            borderColor: this.getColor(this.props.entry.temp, this.props.entry.flow),
            borderWidth: 1,
            padding: 8,
            margin: 3,
            fontFamily: "HelveticaNeue-Light",
            fontSize: 14,
            color: this.getColor(this.props.entry.temp, this.props.entry.flow)
        },

    }
}





