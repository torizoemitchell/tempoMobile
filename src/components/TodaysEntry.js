import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default TodaysEntry = (props) => {
    return (
        <View style={styles.entryContainer}>
            <Text>Entry</Text>
        </View>
    )
}

styles = StyleSheet.create({
    entryContainer: {
        justifyContent: "center",
        alignItems: "center",
    }
})