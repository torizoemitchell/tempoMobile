import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CalendarList } from 'react-native-calendars'

class CalendarScreen extends Component {

    state = {
        currentDate: '',
        name: '',
        averageCycleLength: 0,
        avDayInCycleOvulOccurs: 0,
        userEntries: [],
        indicatorDates: [],
        firstDaysOfPeriods: [],
        markedDates: {},
        
    }
    //each time the calendar mounts, 
    //1) do a request for entries
    //2) calculate the previous periods & high risk days. 
    //3) calculate the average cycle length & predicted periods. 
    //4) calculate the average day in the cycle that the indicator day occurs & predicted High Risk Days.
    //5) if there is a change in the average cycle length or indicator day, POST the new cycle length or indictor day to user data and update it in state.
    componentDidMount = async() => {

        this.setState({
            ...this.state,
            currentDate: new Date(Date.now()).toString().substring(0, 15)
        })
        await this.getEntries()
        await this.getUserInfo()
        this.addPredictionsToMarkedDates()
        
        

        
        
    }
    //GET request for entries then set state with response
    //calls createMarkedDates to combine objects created by helper functions to create the marked Dates object for the calendar. 
    getEntries = async () => {
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

    //GET request for user info and set state with name and cycle length
    getUserInfo = async () => {
        const response = await fetch('http://localhost:3000/users/1')
        const jsonResponse = await response.json()
        this.setState({
            ...this.state,
            name: jsonResponse[0].name,
            averageCycleLength: jsonResponse[0].cycle_length
        })
    }

    //takes an array of objects
    //calls helper functions checkPeriodDays and checkHighRiskDays which create objects that will be: 
    //1) marked dates for periods. 
    //2) marked dates for high risk days.
    //combines the objects into a single object rendered in the calendar. 
    createMarkedDates = (arrayOfEntries) => {
        let periodDates = this.checkPeriodDays(arrayOfEntries)
        let highRiskDays = this.checkHighRiskDays(arrayOfEntries)
        let retObject = Object.assign(periodDates, highRiskDays)
        return retObject
    }

    //uses state to retrieve indicatorDates and firstDaysOfPeriods.
    //calls helper functions calculatePeriodPerdiction and calculateHRDaysPerdiction that use these arrays to create objects:
    //1) marked dates for period perdictions
    //2) marked dates for high risk days perdictions
    //adds them to the marked dates object being rendered in the calendar.
    addPredictionsToMarkedDates = () => {
        console.log("indicator Dates: ", this.state.indicatorDates)
        // let highRiskDaysPrediction = this.calculatePeriodPerdiction(this.state.indicatorDates)
        
        // console.log("marked Dates for HR day prediction: ",  highRiskDaysPrediction)

    }

    //helper function called by createMarkedDates
    //returns an object that will become the marked dates object for the users period. 
    checkPeriodDays = (arrayOfEntries) =>{
        let markedDates = {}
        for (i = 0; i < arrayOfEntries.length; i++) {
            let currentEntry = arrayOfEntries[i]
            let previousEntry = arrayOfEntries[i-1]

            //if the first record is true for flow, make it the starting day
            if (i === 0 && currentEntry.flow) {
                markedDates[currentEntry.date] = { startingDay: true, color: '#e97a7a' }
            }
            //check if it's a start date
            else if (i > 0 && currentEntry.flow && !previousEntry.flow) {
                markedDates[currentEntry.date] = { startingDay: true, color: '#e97a7a' }
            }
            //check if flow is true on the current day
            else if (currentEntry.flow) {
                markedDates[currentEntry.date] = { color: '#e97a7a' }
            }
            //check if it's the end date
            else if (i > 0 && !currentEntry.flow && previousEntry.flow) {
                markedDates[previousEntry.date] = { endingDay: true, color: '#e97a7a' }
            }
        }
        return markedDates
    }

    //helper function called by createMarkedDates
    //returns an object that will become the marked dates object for the users High Risk Days. 
    checkHighRiskDays = (arrayOfEntries) => {
        let indicatorDates = []
        let markedDates = {}
        //find increase in temperature
        for(let i = 1; i < arrayOfEntries.length; i++){
            let currentEntryTemp = arrayOfEntries[i].temp
            let prevEntryTemp = arrayOfEntries[i - 1].temp
            //if temp for current entry is larger than the temp for the previous entry for more than .5 of a degree, this indicates the spike in risk. 
            if(currentEntryTemp > prevEntryTemp && (currentEntryTemp - prevEntryTemp) > 0.4){
                indicatorDates.push(arrayOfEntries[i].date) 
            }
        }
        //create object of marked periods for high risk days
        for(let i = 0; i < indicatorDates.length; i++){
            //add the time zone when creating date object to get the correct date
            let indicatorDate = new Date(indicatorDates[i] + 'T00:00:00-07:00')
            
            //subtract 1 from that day = Ovulation Day, #ff4c00
            let ovulationDay = new Date(indicatorDate)
            ovulationDay.setDate(ovulationDay.getDate() - 1)
            ovulationDay = this.formatDate(ovulationDay)
            markedDates[ovulationDay] = { endingDay: true, color: '#ff4c00'}

            //subtract 2 from that day = High Risk Day 2 #ff4c00
            let HRDay2 = new Date(indicatorDate)
            HRDay2.setDate(HRDay2.getDate() - 2)
            HRDay2 = this.formatDate(HRDay2)
            markedDates[HRDay2] = { color: '#ff4c00' }

            //subtract 3 from that day = High Risk Day 1 #ff8c00
            let HRDay1 = new Date(indicatorDate)
            HRDay1.setDate(HRDay1.getDate() - 3)
            HRDay1 = this.formatDate(HRDay1)
            markedDates[HRDay1] = { color: '#ff8c00' }

            //subtract 4 from that day = Moderate Risk Day 3 #ff8c00
            let ModDay3 = new Date(indicatorDate)
            ModDay3.setDate(ModDay3.getDate() - 4)
            ModDay3 = this.formatDate(ModDay3)
            markedDates[ModDay3] = { color: '#ff8c00' }

            //subtract 5 from that day = Moderate Risk Day 2 #ffcc00
            let ModDay2 = new Date(indicatorDate)
            ModDay2.setDate(ModDay2.getDate() - 5)
            ModDay2 = this.formatDate(ModDay2)
            markedDates[ModDay2] = { color: '#ffcc00' }

            //subtract 6 from that day = Moderate Risk Day 1 #ffcc00
            let ModDay1 = new Date(indicatorDate)
            ModDay1.setDate(ModDay1.getDate() - 6)
            ModDay1 = this.formatDate(ModDay1)
            markedDates[ModDay1] = { startingDay: true, color: '#ffcc00' }
        }

        console.log("setting state with indicator dates: ", indicatorDates)
        //set state with indicator dates to use for predicting future high risk dates. 
        this.setState({
            ...this.state,
            indicatorDates: indicatorDates
        })

        //console.log("markedDates: ", markedDates)
        return markedDates
    }

    //takes an array of dates indicating the first day of the period for each cycle
    //calculates the average cycle length
    //if the average cycle length is different than what's in the user info, POST the new cycle length to the server. 
    //returns an object that represents the marked dates for period perdictions 3 months out.
    calculatePeriodPerdiction = () =>{

    }



    //takes type Date 
    //returns type string
    formatDate = (date) => {
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.statusSection}>
                    <Text>Hello, {this.state.name ? this.state.name : "loading"}</Text>
                    <Text> Today: {this.state.currentDate}</Text>
                    <Text> First Indicator Date: {this.state.indicatorDates[0] ? this.state.indicatorDates[0] : "loading"}</Text>
                </View>
                <CalendarList
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