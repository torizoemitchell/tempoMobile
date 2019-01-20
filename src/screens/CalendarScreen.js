import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars'
import CalendarModal from '../components/CalendarModal'

class CalendarScreen extends Component {

    state = {
        currentDate: '',
        name: '',
        averageCycleLength: 0,
        avDayInCycleOvulOccurs: 0,
        userEntries: [],
        indicatorDates: [],
        firstDaysOfPeriods: [],
        predictedFirstDaysOfPeriods: [],
        markedDates: {},
        modalVisible: false,
        selectedDay: {},
        
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
    addPredictionsToMarkedDates = async() => {
        let periodDatesPrediction = await this.calculatePeriodPrediction(this.state.firstDaysOfPeriods)
        let highRiskDaysPrediction = await this.calculateHighRiskDaysPrediction(this.state.indicatorDates, this.state.firstDaysOfPeriods)
        let newMarkedDates = Object.assign(this.state.markedDates, periodDatesPrediction, highRiskDaysPrediction)
        this.setState({
            ...this.state,
            markedDates: newMarkedDates
        })

    }

    //helper function called by createMarkedDates
    //returns an object that will become the marked dates object for the users period. 
    checkPeriodDays = (arrayOfEntries) =>{
        let markedDates = {}
        let firstDaysOfPeriods = []
        for (i = 0; i < arrayOfEntries.length; i++) {
            let currentEntry = arrayOfEntries[i]
            let previousEntry = arrayOfEntries[i-1]

            //if the first record is true for flow, make it the starting day
            if (i === 0 && currentEntry.flow) {
                markedDates[currentEntry.date] = { startingDay: true, color: '#e97a7a' }
                firstDaysOfPeriods.push(currentEntry.date)
            }
            //check if it's a start date
            else if (i > 0 && currentEntry.flow && !previousEntry.flow) {
                markedDates[currentEntry.date] = { startingDay: true, color: '#e97a7a' }
                firstDaysOfPeriods.push(currentEntry.date)
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
        this.setState({
            ...this.state,
            firstDaysOfPeriods: firstDaysOfPeriods
        })
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
        //set state with indicator dates to use for predicting future high risk dates. 
        this.setState({
            ...this.state,
            indicatorDates: indicatorDates
        })
        return markedDates
    }

    //takes an array of dates indicating the first day of the period for each cycle
    //calculates the average cycle length
    //if the average cycle length is different than what's in the user info, POST the new cycle length to the server and update the state. 
    //returns an object that represents the marked dates for period perdictions 3 for months out.
    calculatePeriodPrediction = (firstDaysOfPeriods) =>{
        let markedDates = {}

        //cycle length = number of days between the first day of 2 cycles
        let cycleLengths = []
        let milliSecsInOneDay = 24 * 60 * 60 * 1000
        for(let i = 1; i < firstDaysOfPeriods.length; i++){
            let current = new Date(firstDaysOfPeriods[i])
            let previous = new Date(firstDaysOfPeriods[i - 1])
            //calculate the difference between current and previous then push into cycle lengths
            let daysBetween = Math.round(Math.abs((previous.getTime() - current.getTime()) / (milliSecsInOneDay)))
            cycleLengths.push(daysBetween)
        }
        let sum = cycleLengths.reduce((a, b) => {return a + b})
        let average = sum/(firstDaysOfPeriods.length - 1)

        //check to see if the average cycle length has changed
        if(average != this.state.averageCycleLength){
            //send POST request
            //......

            //Update state
            this.setState({
                ...this.state,
                averageCycleLength: average
            })
        }

        //create period predictions for 3 months out: 
        let newFirstDays = []
        let mostRecentFirstDay = new Date(firstDaysOfPeriods[firstDaysOfPeriods.length - 1] + 'T00:00:00-07:00')
        let accumulator = average
        for(let i = 0; i < 3; i++){
            let newFirstDay = new Date()
            newFirstDay.setDate(mostRecentFirstDay.getDate() + accumulator);
            accumulator = accumulator + average
            let formatedNewDate = this.formatDate(newFirstDay)
            newFirstDays.push(formatedNewDate)
        }
        //need newFirstDays in state to use for High Risk Days Predictions
        this.setState({
            ...this.state,
            predictedFirstDaysOfPeriods: newFirstDays
        })

        newFirstDays.forEach((day)=>{
            markedDates[day] = { startingDay: true, color: '#f4bcbc', endingDay: true, }
        })
        return markedDates
    }

    //************Need the most up-to-date average cycle length before this is executed*******************
    //takes an array of dates indicating the first day of the period for each cycle
    //also takes an array of dates indicating the indicator days for each cycle
    //calculates the average length between the 1st day in the cycle and the indicator day to determine the average day of the cycle on which ovulation occurs. 
    //if the average is different than what's in the user info, POST the new info to the server and update the state.
    //returns an object that represents the marked dates for High Risk days perdictions for 3 months out.
    calculateHighRiskDaysPrediction = (indicatorDates, firstDaysOfPeriods) => {
        let markedDates = {}
        let avDayInCycleOvulOccurs

        //if the arrays are the same length, the next indicator day just happened and we have an equal number of indexes to calculate the average with.  
        if(indicatorDates.length === firstDaysOfPeriods.length){
            //*************************/EDGE CASE COME BACK TO THISSSSSS
            //if this is the case use the nearest predicted first day to calculate the distance for the last cycle (indicatorDate - firstDayInPeriod)
        }
        //if the indicator days array is shorter than the first days array, calculate from the most recent first day of period (last one to be found in firstDaysOfPeriods).
        else{
            let daysOnWhichOvulOccured = []
            for(let i = 0; i < indicatorDates.length; i++){
                let indicatorDate = new Date(indicatorDates[i] + 'T00:00:00-07:00')
                let firstDayOfPeriod = new Date(firstDaysOfPeriods[i] + 'T00:00:00-07:00')
                let days = ((indicatorDate - firstDayOfPeriod)/ (1000 * 60 * 60 * 24))
                daysOnWhichOvulOccured.push(days)
            }
            let sum = daysOnWhichOvulOccured.reduce((a, b) => {return a + b})
            avDayInCycleOvulOccurs = (sum / daysOnWhichOvulOccured.length)
        }

        //create object with marked dates for prediction:
        //start from the most recent first day of period if the lengths of the argument arrays are not equal.
        //start from the nearest predicted first day of period if the lengths are the same. 
        
        let predictedFirstDaysOfPeriods = [...this.state.predictedFirstDaysOfPeriods]
        let formatStartDates = []
        predictedFirstDaysOfPeriods.forEach((date) => { formatStartDates.push(new Date(date + 'T00:00:00-07:00')) })

        //add a different start date if the lengths are the same
        if(indicatorDates.length != firstDaysOfPeriods.length){
            let startDate = new Date(firstDaysOfPeriods[firstDaysOfPeriods.length - 1] + 'T00:00:00-07:00')
            formatStartDates = [startDate, ...formatStartDates]
        }
        
        for (let i = 0; i < formatStartDates.length; i++) {
            //add the cycle length to the start date = predicted day on which ovul. occurs, #ff9f76
            let ovulationDay = formatStartDates[i]
            ovulationDay.setDate(ovulationDay.getDate() + avDayInCycleOvulOccurs)
            markedDates[this.formatDate(ovulationDay)] = { endingDay: true, color: '#ff9f76' }

            //subtract 1 from ovulation day = High Risk Day 2 #ff9f76
            let HRDay2 = ovulationDay
            HRDay2.setDate(HRDay2.getDate() - 1)
            markedDates[this.formatDate(HRDay2)] = { color: '#ff9f76' }

            //subtract 1 from HRday2 = High Risk Day 1 #ffc176
            let HRDay1 = HRDay2
            HRDay1.setDate(HRDay1.getDate() - 1)
            markedDates[this.formatDate(HRDay1)] = { color: '#ffc176' }

            //subtract 1 from HRDay1 = Moderate Risk Day 3 #ffc176
            let ModDay3 = HRDay1
            ModDay3.setDate(ModDay3.getDate() - 1)
            markedDates[this.formatDate(ModDay3)] = { color: '#ffc176' }

            //subtract 1 from that day = Moderate Risk Day 2 #ffeb9d
            let ModDay2 = ModDay3
            ModDay2.setDate(ModDay2.getDate() - 1)
            markedDates[this.formatDate(ModDay2)] = { color: '#ffeb9d' }

            //subtract 1 from ModDay2 = Moderate Risk Day 1 #ffeb9d
            let ModDay1 = ModDay2
            ModDay1.setDate(ModDay1.getDate() - 1)
            markedDates[this.formatDate(ModDay1)] = { startingDay: true, color: '#ffeb9d' }
        }
        return markedDates
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

    showModal = (day) => {
        console.log("called show modal: ", day)
        console.log("this.state.markedDates", this.state.markedDates)
        console.log("userEntries: ", this.state.userEntries)
        //look for the day in userEntries: 
        let selectedDay = {}
        this.state.userEntries.forEach((entry) => {
            if(entry.date === day.dateString){ selectedDay = entry }
        })
        console.log("found day: ", selectedDay)
        this.setState({
            ...this.state,
            modalVisible: true,
            selectedDay: selectedDay
        })
    }

    render() {
    
        return (
            <View style={styles.container}>
                <View style={styles.statusSection}>
                    <Text>Hello, {this.state.name ? this.state.name : "loading"}</Text>
                    <Text>Today: {this.state.currentDate}</Text>
                </View>
                <Calendar style={styles.calendar}
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
                    }
                    // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                    markingType={'period'}
                    onDayPress={(day) => { this.showModal(day); console.log('selected day', day) }}
              />
                <CalendarModal visible={this.state.modalVisible} selectedDay={this.state.selectedDay}/> 

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
    },
    calendar: {
        height: "50%",
    }
})

export default CalendarScreen;