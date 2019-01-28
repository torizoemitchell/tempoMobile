import React from 'react';
import { Text, View, TextInput, Switch, Alert } from 'react-native';
import { Button } from 'native-base'
import EditTodayModal from './EditTodayModal'

export default class TodaysEntry extends React.Component {

    state = {
        editModalVisible: false,
        tempForToday: '',
        flowForToday: false,
        entryStatus: ''
    }

    updateFlowForToday = () => {
        this.setState({
            ...this.state,
            flowForToday: !this.state.flowForToday,
        })
    }

    updatetempForToday = (temp) => {
        this.setState({
            ...this.state,
            tempForToday: temp,
        })
    }

    //takes type Date 
    //returns type string
    formatDate = (date) => {
        console.log("date: ", date)
        let months = ['0', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let month = 'month not found'
        //check if the index of the month is one digit
        if (months.indexOf(date.toString().substring(4, 7)) < 10) {
            month = `0${months.indexOf(date.toString().substring(4, 7))}`
        } else {
            month = `${months.indexOf(date.toString().substring(4, 7))}`
        }
        return `${date.toString().substring(11, 15)}-${month}-${date.toString().substring(8, 10)}`
    }

    postNewEntry = async() => {
        let temp = parseInt(this.state.tempForToday)
        if(temp > 100){
            Alert.alert('Error', 'Please enter a valid temperature. Do not record your temperature today if you have a fever.', [{ text: 'OK' },])
            return
        }
        else if(temp < 97){
            Alert.alert('Error', 'Please enter a valid temperature.', [{ text: 'OK' },])
            return
        }else{
            //check to make sure a change has been made, show an error if not.
            if (this.state.temp === '') {
                Alert.alert('Error', 'Please add both temperature and your menstruation before submitting.', [{ text: 'OK' },])
                return
            }
            let currentDate = this.formatDate(this.props.selectedDay).trim()
            let requestURL = `https://tempomobile.herokuapp.com/entries/` + `${this.props.userId}`
            try{
                const response = await fetch(`${requestURL}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        date: currentDate,
                        flow: this.state.flowForToday,
                        temp: this.state.tempForToday
                    })
                })
                const jsonResponse = await response.json()
                console.log("jsonresponse: ", jsonResponse)
            } catch(error){
                console.log('fetch catch on entry id', error)
            }
            this.setState({
                ...this.state,
                tempForToday: '',
                flowForToday: false
            })
            this.props.updateTodaysEntryOnEdit()
        }
    }

    completeEntryExists = (props, style) => {
        return(
            <View>
                <View style={style.container}>

                    <View style={style.inputContainer}>
                        <Text style={style.text}>Temp (F): </Text>
                        <Text style={style.tempInput}>
                            {props.entry.temp}
                        </Text>
                    </View>
                    
                    <View style={style.inputContainer}>
                        <Text style={style.text}>Menstruating: </Text>
                        <Text style={this.styles.flowInput}>
                            {props.entry.flow ? "Yes" : "No"}
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

    syncWithTherm = () =>{
        this.props.updateTodaysEntryOnEdit()
    }

    
    entryDoesNotExist = (style) => {
        return(
            <View>
                <View style={this.styles.container}>

                    <View style={this.styles.reminderContainer}>
                        <Text style={style.reminderText}>Please record your entry for today.</Text>
                    </View>

                    <View style={style.inputFields}>
                        <Text style={style.text}>Temp: </Text>
                        <TextInput
                            value={this.state.tempForToday}
                            style={style.tempInput}
                            onChangeText={(text) => { this.updatetempForToday(text) }} 
                        />
                        <Button small block light style={style.button} onPress={this.syncWithTherm}>
                            <Text style={style.buttonText}>Sync with Thermometer</Text>
                        </Button>
                    </View>

                    <View style={style.inputFields}>
                        <Text style={style.text}>Menstruating: No </Text>
                        <Switch
                            value={this.state.flowForToday}
                            onValueChange={this.updateFlowForToday}
                        />
                        <Text style={style.text}> Yes</Text>
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

    updateEntry = async() =>{
        let entryId = this.props.entry.id
        let requestURL = 'https://tempomobile.herokuapp.com/entries/' + `${entryId}`
        const response = await fetch(`${requestURL}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                flow: this.state.flowForToday,
            })
        })
        const jsonResponse = await response.json()
        console.log("jsonResponse: ", jsonResponse)
        this.props.updateTodaysEntryOnEdit()
    }

    tempButNoFlow = (props, style) => {
        return (
            <View>
                <View style={this.styles.container}>

                    <View style={this.styles.reminderContainer}>
                        <Text style={style.reminderText}>Please record your flow for today.</Text>
                    </View>

                    <View style={style.inputFields}>
                        <Text style={style.tempText}>Temp: </Text>
                        <Text style={style.tempInput}>
                            {props.entry.temp}
                        </Text>
                    </View>

                    <View style={style.inputFields}>
                        <Text style={style.text}>Menstruating: No </Text>
                        <Switch
                            value={this.state.flowForToday}
                            onValueChange={this.updateFlowForToday}
                        />
                        <Text style={style.text}> Yes</Text>
                    </View>

                </View>

                <View style={this.styles.buttonContainer}>
                    <Button small block light onPress={this.updateEntry}>
                        <Text style={this.styles.buttonText}>Submit</Text>
                    </Button>
                </View>

            </View>


        )
    }

    getEntryFormat = (temp, flow) => {
        //if temp and flow are missing, please record your "entry" and make all text red
        //console.log("temp: ", temp, "flow: ", flow)
        if(temp === undefined && flow === undefined){
            console.log("need to display form for entire entry")
            let noEntryStyle = {
                reminderContainer: {
                    alignItems: "center",
                },
                reminderText: {
                    fontSize: 16,
                    fontFamily: "HelveticaNeue-Light",
                    color: "red",
                },
                text:{
                    fontSize: 14,
                    fontFamily: "HelveticaNeue-Light",
                    color: "red"
                },
                tempText: {
                    fontSize: 14,
                    fontFamily: "HelveticaNeue-Light",
                    color: "black"
                },
                tempInput: {
                    width: "30%",
                    borderColor: "red",
                    borderWidth: 1,
                    padding: 4,
                    margin: 2,
                    fontFamily: "HelveticaNeue-Light",
                    fontSize: 15
                },
                inputFields: {
                    flexDirection: "row",
                    padding: 5,
                    alignItems: "center"

                },
                buttonText: {
                    fontFamily: "HelveticaNeue",
                    color: "midnightblue",
                    fontSize: 10,
                    padding: 2,
                },
                button: {
                    width: "40%",
                    margin: 2,
                }
            }
            return this.entryDoesNotExist(noEntryStyle)
        }
        //if the complete entry already exists, show the data with the edit button.
        else if (temp !== undefined && (flow !== undefined && flow!== null)){
            console.log("entry has already been completed")
            let completeEntryStyle = {
                container: {
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                },
                inputContainer: {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                },
                 text: {
                     fontSize: 14,
                     fontFamily: "HelveticaNeue-Light",
                     color: "black"
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

            }
            return this.completeEntryExists(this.props, completeEntryStyle)
        }
        //if temp exists but flow hasn't been recorded yet
        else if ((temp !== null && temp !== undefined) && flow === null){
            console.log("temp exists but flow needs to be recorded")
            noFlowStyle = {
                reminderContainer: {
                    alignItems: "center",
                },
                reminderText: {
                    fontSize: 16,
                    fontFamily: "HelveticaNeue-Light",
                    color: "red",
                },
                text: {
                    fontSize: 14,
                    fontFamily: "HelveticaNeue-Light",
                    color: "red"
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
                inputFields: {
                    flexDirection: "row",
                    padding: 5,
                    alignItems: "center"

                },
            }
            return this.tempButNoFlow(this.props, noFlowStyle)
        }
        //if flow exists but temp hasn't been recorded yet.
        else if (temp === null && flow !== null){
            console.log("flow exists but temp needs to be recorded")
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
        flowInput: {
            width: "38%",
            borderColor: "grey",
            borderWidth: 1,
            padding: 4,
            margin: 2,
            fontFamily: "HelveticaNeue-Light",
            fontSize: 15
        },
        buttonContainer: {
            margin: 5
        },
    }
}





