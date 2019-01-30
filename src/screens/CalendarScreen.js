import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars'
import CalendarModal from '../components/CalendarModal'
import Greeting from '../components/Greeting'
import TodaysEntry from '../components/TodaysEntry'
import Legend from '../components/Legend'

class CalendarScreen extends Component {

    state = {
        currentDate: '',
        riskForCurrentDate: '',
        entryForCurrentDate: {},
        name: '',
        averageCycleLength: 0,
        avDayInCycleOvulOccurs: 0,
        userEntries: [],
        indicatorDates: [],
        firstDaysOfPeriods: [],
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
        let today = new Date(Date.now()).toString().substring(0, 15)
        console.log("today: ", today)
        //let today = new Date('2019-02-06T00:00:00-07:00').toString().substring(0, 15)
        this.setState({
            ...this.state,
            currentDate: today
        })
        await this.loadCalendar()
    }

    loadCalendar = async() => {

        //userEntries = sortedEntriesByDate
        let userEntries = await this.getEntries()

        //userInfo = object with name and averageCycleLength properties
        let userInfo = await this.getUserInfo()

        let createMarks = await this.createMarkedDates(userEntries)
        let markedDatesBeforePredictions = createMarks.markedDates
        let firstDaysOfPeriods = createMarks.firstDaysOfPeriods
        let indicatorDates = createMarks.indicatorDates

        let markedDatesWithPredictions = await this.addPredictionsToMarkedDates(markedDatesBeforePredictions, firstDaysOfPeriods, indicatorDates)
        
        let entryForToday = await this.findEntry(`${this.formatDate(this.state.currentDate)}`)
        console.log("entry for Today: ", entryForToday)
        let riskForToday = await this.getRiskForToday(this.formatDate(this.state.currentDate))
        console.log("riskforCurrentDate: ", riskForToday)

        this.setState({
            ...this.state,
            entryForCurrentDate: entryForToday,
            riskForCurrentDate: riskForToday,
            userEntries: userEntries,
            name: userInfo.name,
            averageCycleLength: userInfo.averageCycleLength,
            markedDates: markedDatesWithPredictions,
        })
    }

    //takes a dateString and returns the entry from the user's entry for that day.
    //returns -1 if the entry is not found. 
    findEntry = (dateString) => {
        let entries = [
            ...this.state.userEntries
        ]
        for(let i = 0; i < entries.length; i++){
            if (entries[i].date == dateString) {
                return entries[i]
            }
        }
        return -1
    }

    //GET request for entries then set state with response
    //calls createMarkedDates to combine objects created by helper functions to create the marked Dates object for the calendar. 
    getEntries = async () => {
        const response = await fetch('https://tempomobile.herokuapp.com/entries/1')
        const jsonResponse = await response.json()
        //console.log("jsonResponse: ", jsonResponse)
        let sortedEntriesByDate = jsonResponse
        sortedEntriesByDate.sort((a, b) => { return (Date.parse(a.date) > Date.parse(b.date)) ? 1 : ((Date.parse(b.date) > Date.parse(a.date)) ? -1 : 0)})
        //console.log("sortedEntriesByDate: ", sortedEntriesByDate)
        // let dates = this.createMarkedDates(jsonResponse)
        // this.setState({
        //     ...this.state,
        //     userEntries: sortedEntriesByDate,
        //     markedDates: dates,
        // })
        return sortedEntriesByDate
    }

    //GET request for user info and set state with name and cycle length
    getUserInfo = async () => {
        const response = await fetch('https://tempomobile.herokuapp.com/users/1')
        const jsonResponse = await response.json()
        // this.setState({
        //     ...this.state,
        //     name: jsonResponse[0].name,
        //     averageCycleLength: jsonResponse[0].cycle_length
        // })
        return {name: jsonResponse[0].name, averageCycleLength: jsonResponse[0].cycle_length}
    }

    //takes an array of objects
    //calls helper functions checkPeriodDays and checkHighRiskDays which create objects that will be: 
    //1) marked dates for periods. 
    //2) marked dates for high risk days.
    //combines the objects into a single object rendered in the calendar. 
    createMarkedDates = (arrayOfEntries) => {
        let periodDatesResults = this.checkPeriodDays(arrayOfEntries)
        let periodDates = periodDatesResults.markedDates
        let firstDaysOfPeriods = periodDatesResults.firstDaysOfPeriods

        let highRiskDaysResults = this.checkHighRiskDays(arrayOfEntries)
        let highRiskDays = highRiskDaysResults.markedDates
        let indicatorDates = highRiskDaysResults.indicatorDates

        let retObject = Object.assign(periodDates, highRiskDays)

        return {markedDates: retObject, firstDaysOfPeriods: firstDaysOfPeriods, indicatorDates: indicatorDates}
    }

    //uses state to retrieve indicatorDates and firstDaysOfPeriods.
    //calls helper functions calculatePeriodPerdiction and calculateHRDaysPerdiction that use these arrays to create objects:
    //1) marked dates for period perdictions
    //2) marked dates for high risk days perdictions
    //adds them to the marked dates object being rendered in the calendar.
    addPredictionsToMarkedDates = async(markedDates, firstDaysOfPeriods, indicatorDates) => {
        let periodDatesPredictionResults = await this.calculatePeriodPrediction(firstDaysOfPeriods)
        let periodDatesPrediction = periodDatesPredictionResults.markedDates
        let newFirstDaysOfPeriods = periodDatesPredictionResults.newFirstDaysOfPeriods
        
        let highRiskDaysPrediction = await this.calculateHighRiskDaysPrediction(indicatorDates, firstDaysOfPeriods, newFirstDaysOfPeriods)
        let newMarkedDates = Object.assign(markedDates, periodDatesPrediction, highRiskDaysPrediction)
    
        return newMarkedDates
    }

    //helper function called by createMarkedDates
    //returns an object that will become the marked dates object for the users period. 
    checkPeriodDays = (arrayOfEntries) =>{
        let markedDates = {}
        let firstDaysOfPeriods = []
        for (i = 0; i < arrayOfEntries.length - 1; i++) {
            let currentEntry = arrayOfEntries[i]
            let previousEntry = arrayOfEntries[i-1]
            let nextEntry = arrayOfEntries[i+1]

            //if the first record is true for flow, make it the starting day
            if (i === 0 && currentEntry.flow) {
                markedDates[currentEntry.date] = { startingDay: true, color: '#e97a7a' }
                firstDaysOfPeriods.push(currentEntry.date)
            }

            //check if it's a start date
            else if (i > 0 && currentEntry.flow && !previousEntry.flow) {
                //in this case it's spotting: (isolated period day)
                if (!nextEntry.flow) {
                    markedDates[currentEntry.date] = { startingDay: true, color: '#e97a7a', endingDay: true }
                } else {
                    markedDates[currentEntry.date] = { startingDay: true, color: '#e97a7a' }
                    firstDaysOfPeriods.push(currentEntry.date)
                } 
            }

            //check if it's the end date
            else if (i > 0 && currentEntry.flow && !nextEntry.flow) {
                //in this case it's spotting: (isolated period day)
                if (!previousEntry.flow) {
                    markedDates[currentEntry.date] = { startingDay: true, color: '#e97a7a', endingDay: true }
                } else {
                    markedDates[currentEntry.date] = { endingDay: true, color: '#e97a7a' }
                }
            }

            //check if flow is true on the current day
            else if (currentEntry.flow) {
                markedDates[currentEntry.date] = { color: '#e97a7a' }
            }
        }
        // this.setState({
        //     ...this.state,
        //     firstDaysOfPeriods: firstDaysOfPeriods
        // })
        return {markedDates: markedDates, firstDaysOfPeriods: firstDaysOfPeriods}
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
            if((currentEntryTemp > prevEntryTemp) && (currentEntryTemp - prevEntryTemp) > 0.4){
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
      
        return {markedDates: markedDates, indicatorDates: indicatorDates}
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

        //create period predictions for 3 months out: 
        let newFirstDays = []

        let mostRecentFirstDay = new Date(firstDaysOfPeriods[firstDaysOfPeriods.length - 1] + 'T00:00:00-07:00')

        let mostRecentFirstDayMS = mostRecentFirstDay.getTime()
        let averageMS = (average * 86400000) //milliseconds in one day
        let accumulatorMS = averageMS

        for(let i = 0; i < 3; i++){
            let newFirstDayMS = mostRecentFirstDayMS + accumulatorMS
            let newFirstDay = new Date(newFirstDayMS)
            accumulatorMS = accumulatorMS + averageMS
            let formatedNewDate = this.formatDate(newFirstDay)

            newFirstDays.push(formatedNewDate)
        }

        newFirstDays.forEach((day)=>{
            markedDates[day] = { startingDay: true, color: '#f4bcbc', endingDay: true, }
        })
        return {markedDates: markedDates, newFirstDaysOfPeriods: newFirstDays}
    }

    //************Need the most up-to-date average cycle length before this is executed*******************
    //takes an array of dates indicating the first day of the period for each cycle
    //also takes an array of dates indicating the indicator days for each cycle
    //calculates the average length between the 1st day in the cycle and the indicator day to determine the average day of the cycle on which ovulation occurs. 
    //if the average is different than what's in the user info, POST the new info to the server and update the state.
    //returns an object that represents the marked dates for High Risk days perdictions for 3 months out.
    calculateHighRiskDaysPrediction = (indicatorDates, firstDaysOfPeriods, newFirstDaysOfPeriods) => {
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
        
        let predictedFirstDaysOfPeriods = newFirstDaysOfPeriods
        let startDatesMS = []
        // predictedFirstDaysOfPeriods.forEach((date) => { startDatesMS.push(new Date(date).getTime()) })
        for(let i = 0; i < predictedFirstDaysOfPeriods.length; i++){
            let dateMS = new Date (predictedFirstDaysOfPeriods[i]).getTime()
            startDatesMS.push(dateMS)
        }

        //add a different start date if the lengths are the same
        if(indicatorDates.length != firstDaysOfPeriods.length){
            let startDateMS = new Date(firstDaysOfPeriods[firstDaysOfPeriods.length - 1] + 'T00:00:00-07:00').getTime()
            startDatesMS.unshift(startDateMS) 
        }
        
        for (let i = 0; i < startDatesMS.length; i++) {
            //add the cycle length to the start date = predicted day on which ovul. occurs, #ff9f76
            let ovulationDayMS = startDatesMS[i] + (avDayInCycleOvulOccurs * 86400000)
            let ovulationDay = new Date(ovulationDayMS)
            markedDates[this.formatDate(ovulationDay)] = { endingDay: true, color: '#ff9f76' }

            //subtract 1 from ovulation day = High Risk Day 2 #ff9f76
            let HRDay2MS = (ovulationDayMS - 86400000)
            HRDay2 = new Date (HRDay2MS)
            markedDates[this.formatDate(HRDay2)] = { color: '#ff9f76' }

            //subtract 1 from HRday2 = High Risk Day 1 #ffc176
            let HRDay1MS = (HRDay2MS - 86400000)
            HRDay1 = new Date(HRDay1MS)
            markedDates[this.formatDate(HRDay1)] = { color: '#ffc176' }

            //subtract 1 from HRDay1 = Moderate Risk Day 3 #ffc176
            let ModDay3MS = (HRDay1 - 86400000)
            ModDay3 = new Date(ModDay3MS)
            markedDates[this.formatDate(ModDay3)] = { color: '#ffc176' }

            //subtract 1 from that day = Moderate Risk Day 2 #ffeb9d
            let ModDay2MS = (ModDay3 - 86400000)
            ModDay2 = new Date(ModDay2MS)
            markedDates[this.formatDate(ModDay2)] = { color: '#ffeb9d' }

            //subtract 1 from ModDay2 = Moderate Risk Day 1 #ffeb9d
            let ModDay1MS = (ModDay2 - 86400000)
            ModDay1 = new Date(ModDay1MS)
            markedDates[this.formatDate(ModDay1)] = { startingDay: true, color: '#ffeb9d' }
        }
        
        return markedDates
    }

    //takes a dateString and returns the risk of pregnancy for that date. 
    //returns a string: Low, Moderate, High or Very High
    getRiskForToday = (date) =>{
        let dateString = this.formatDate(date)
        let markedDateEntry
        for(entry in this.state.markedDates){
            if(entry === dateString){
                markedDateEntry = this.state.markedDates[entry]
            }
        }
        if(markedDateEntry === undefined){
            return {risk: "Low", color: 'black'}
        }
        let retObj = {}
        switch (markedDateEntry.color){
            case '#e97a7a': 
                retObj = { risk: "Low", color: 'black' }
                break
            case '#ff4c00':
                retObj = { risk: "Very High", color: '#ff4c00' }
                break
            case '#ff9f76':
                retObj = { risk: "Very High", color: '#ff4c00' }
                break
            case '#ff8c00':
                retObj = { risk: "High", color: '#ff8c00' }
                break
            case '#ffc176':
                retObj = { risk: "High", color: '#ff8c00' }
                break
            case '#ffcc00':
                retObj = { risk: "Moderate", color: '#ffcc00'}
                break
            case '#ffeb9d':
                retObj = { risk: "Moderate", color: '#ffcc00' }
                break
            default:
                break
        }
        return retObj
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
        //look for the day in userEntries: 
        let selectedDay = {}
        this.state.userEntries.forEach((entry) => {
            if(entry.date === day.dateString){ selectedDay = entry }
        })
        this.setState({
            ...this.state,
            modalVisible: true,
            selectedDay: selectedDay
        })
    }

    closeModal = () => {
        this.loadCalendar()
        this.setState({
            ...this.state,
            modalVisible: false
        })
    }

    updateTodaysEntryOnEdit = () => {
        console.log("updateTodaysEntryOnEdit called")
        this.loadCalendar()
    }

    updateAnotherEntryOnEdit = () => {
        this.loadCalendar()
        this.closeModal()
    }

    deleteTodaysEntry = async(id) => {
        console.log("delete entry from calendar screen")
        console.log("id to delete from calendar screen: ", id)
        //add ALERT? are you sure you want to delete this entire entry?
        let deleteEntryId = id
        let requestURL = 'https://tempomobile.herokuapp.com/entries/' + `${deleteEntryId}`
        const response = await fetch(`${requestURL}`, {
            method: 'DELETE',
        })
        console.log("response: ", response)
        const jsonResponse = await response.json()

        console.log("jsonResponse: ", jsonResponse)
        this.setState({
            ...this.state,
            entryForCurrentDate: -1,
        })
        

    }


    render() {
        console.log("this.state.entryForCurrentDate: ", this.state.entryForCurrentDate)
        return (
            <View style={styles.container}>

                <View style={styles.greetingSection}>
                    <Greeting 
                        name={this.state.name} 
                        currentDate={this.state.currentDate}
                    />
                </View>

                <View style={styles.entrySection}>
                    <TodaysEntry 
                        userId={1}
                        entry={this.state.entryForCurrentDate} 
                        updateTodaysEntryOnEdit={this.updateTodaysEntryOnEdit}
                        selectedDay={this.state.currentDate}
                        deleteTodaysEntry={this.deleteTodaysEntry}
                    />
                </View>

                <View style={styles.key}>
                    <Legend 
                        riskForCurrentDate={this.getRiskForToday(this.state.currentDate)}
                    />
                </View>

                <Calendar style={styles.calendar}

                    // Max amount of months allowed to scroll to the past. Default = 50
                    //pastScrollRange={50}
                    // Max amount of months allowed to scroll to the future. Default = 50
                    //futureScrollRange={50}
                    // Enable or disable scrolling of calendar list
                    //scrollEnabled={true}
                    // Enable or disable vertical scroll indicator. Default = false
                    //showScrollIndicator={true}
                    // Collection of dates that have to be colored in a special way. Default = {}
                    markedDates={
                        //markedDatesFromState 
                        this.state.markedDates
                    }
                    // markedDates={{
                    //     '2019-02-05': {color: "blue"},
                    //     '2019-02-06': { color: "blue" },
                    //     '2019-02-07': { color: "blue" },
                    //     '2019-02-08': { color: "blue" },
                    // }
                    // }
                    // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                    markingType={'period'}
                    onDayPress={(day) => { this.showModal(day); console.log('selected day', day) }}
                />
        

                <CalendarModal 
                    visible={this.state.modalVisible} 
                    selectedDay={this.state.selectedDay}
                    closeModal={this.closeModal}
                    updateAnotherEntryOnEdit={this.updateAnotherEntryOnEdit}
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
        alignItems: "stretch",
        
    },
    greetingSection: {
        height: "10%",
    },
    entrySection: {
        height: "26%",
        justifyContent: "center",
        alignItems: "center",
    },
    key: {
        height: "9%",
        justifyContent: "center",
        alignItems: "center",
    },
    calendar: {
        height: "55%",
        marginBottom: 20,
    }
})

export default CalendarScreen;

        