import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default Greeting = (props) => {
    return (
        <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Hello, {props.name ? props.name : ""}.</Text>
            <Text style={styles.dateText}>{props.currentDate}</Text>
        </View>
    )

}

styles = StyleSheet.create({
    greetingContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        
    },
    greetingText: {
        fontSize: 40,
        fontFamily: "HelveticaNeue-UltraLight",
    },
    dateText: {
        fontSize: 20,
        fontFamily: "HelveticaNeue-Light"
    }

})