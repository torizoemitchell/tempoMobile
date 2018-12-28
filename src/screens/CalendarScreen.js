import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { CalendarList } from 'react-native-calendars'

class CalendarScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Text>On CalendarScreen</Text>
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
                        {
                            '2019-01-01': { startingDay: true, color: 'green' },
                            '2019-01-02': { selected: true, color: 'green' },
                            '2019-01-03': { selected: true, color: 'green' },
                            '2019-01-04': { endingDay: true, color: 'green'}
                        }}
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
        justifyContent: "center",
        alignItems: "center"
    },
})

export default CalendarScreen;