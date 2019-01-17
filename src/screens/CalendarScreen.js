import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CalendarList } from 'react-native-calendars'

class CalendarScreen extends Component {

    state = {
        currentDate: '',
        userEntries: [],
    }

    componentDidMount = () => {
        this.setState({
            ...this.state,
            currentDate: new Date(Date.now()).toString().substring(0, 15)
        })
        console.log("date today: ", this.state.currentDate)
        this.getEntries()
        
    }

    getEntries = async () => {
        console.log("getImages")
        const response = await fetch('http://localhost:3000/entries/1')
        const jsonResponse = await response.json()
        console.log("jsonResponse: ", jsonResponse)
        let dates = this.createMarkedDates(jsonResponse)
        this.setState({
            ...this.state,
            userEntries: jsonResponse,
            markedDates: dates,
        })
    }

    //helper function called by createMarkedDates
    //returns an object that will become the marked dates object for the users period. 
    checkPeriodDays = (arrayOfEntries) =>{
        let markedDates = {}
        for (i = 0; i < arrayOfEntries.length; i++) {
            //console.log("i: ", i, "entry.flow: ", arrayOfEntries[i].flow, "next entry.flow: ", arrayOfEntries[i + 1].flow )
            //if the first record is true for flow, make it the starting day
            if (i === 0 && arrayOfEntries[i].flow) {
                markedDates[arrayOfEntries[i].date] = { startingDay: true, color: '#e97a7a' }
            }
            //check if it's a start date
            else if (i > 0 && arrayOfEntries[i].flow && !arrayOfEntries[i - 1].flow) {
                markedDates[arrayOfEntries[i].date] = { startingDay: true, color: '#e97a7a' }
            }
            //check if flow is true
            else if (arrayOfEntries[i].flow) {
                markedDates[arrayOfEntries[i].date] = { color: '#e97a7a' }
            }
            //check if it's the end date
            else if (i > 0 && !arrayOfEntries[i].flow && arrayOfEntries[i - 1].flow) {
                console.log("gets here")
                markedDates[arrayOfEntries[i].date] = { endingDay: true, color: '#e97a7a' }
            }

        }
        return markedDates
    }

    //helper function called by createMarkedDates
    //returns an object that will become the marked dates object for the users period. 
    checkHighRiskDays = (arrayOfEntries) => {
        let indicatorDates = []
        let markedDates = {}
        //find increase in temperature
        for(let i = 1; i < arrayOfEntries.length; i++){
            let currentEntryTemp = arrayOfEntries[i].temp
            let prevEntryTemp = arrayOfEntries[i - 1].temp
            //if temp for current entry is larger than the temp for the previous entry for more than .5 of a degree, this indicates the spike in risk. 
            if(currentEntryTemp > prevEntryTemp && (currentEntryTemp - prevEntryTemp) > 0.4){
                console.log("indicator date found: ", arrayOfEntries[i].date)
                indicatorDates.push(arrayOfEntries[i].date) 
            }
        }
        
        markedDates[arrayOfEntries[6].date] = {color: 'blue'}
        return markedDates
    }
    //takes an array of objects
    //calls helper functions that create 4 objects that will be: 
    //1) marked dates for periods. 
    //2) marked dates for high risk days.
    //3) marked dates for predicted periods in the future.
    //4) marked dates for predicted high risk days in the future. 
    //combines the objects into a single object rendered in the calendar. 
    createMarkedDates = (arrayOfEntries) => {
        let periodDates = this.checkPeriodDays(arrayOfEntries)
        let highRiskDays = this.checkHighRiskDays(arrayOfEntries)
        let retObject = Object.assign(periodDates, highRiskDays)
        return retObject
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.statusSection}>
                    <Text>Hello, [Username]</Text>
                    <Text> Today: {this.state.currentDate}</Text>
                    <Text> First Entry {this.state.userEntries[0] ? this.state.userEntries[0].temp : "loading"}</Text>
                </View>
                <CalendarList
                    // Callback which gets executed when visible months change in scroll view. Default = undefined
                    onVisibleMonthsChange={(months) => { console.log('now these months are visible', months); }}
                    // Max amount of months allowed to scroll to the past. Default = 50
                    pastScrollRange={50}
                    // Max amount of months allowed to scroll to the future. Default = 50
                    futureScrollRange={50}
                    // Enable or disable scrolling of calendar list
                    scrollEnabled={true}
                    // Enable or disable vertical scroll indicator. Default = false
                    showScrollIndicator={true}
                    // Collection of dates that have to be colored in a special way. Default = {}
                    markedDates={
                        this.state.markedDates ? this.state.markedDates : {}
                        // {
                        //     '2019-01-01': { startingDay: true, color: 'green' },
                        //     '2019-01-02': { selected: false, color: 'green' },
                        //     '2019-01-03': { selected: false, color: 'green' },
                        //     '2019-01-04': { endingDay: true, color: 'green'}
                        // }
                    }
                    // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                    markingType={'period'}
              />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch"
    },
    statusSection: {
        height: 100,
        padding: 30,
    }
})

export default CalendarScreen;