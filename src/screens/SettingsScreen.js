import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

class SettingsScreen extends Component {
    render() {
        return (
            <View style={this.styles.container}>
                <View style={this.styles.userIcon}>
                    <Icon name="user-o" size={70} color="midnightblue" />
                </View>
                
                <Text>On SettingsScreen</Text>
            </View>
        );
    }

    styles = {
        container: {
            justifyContent: "center",
            alignItems: "center"
        },
        userIcon: {
            justifyContent: "center",
            alignItems: "center",
            padding: 30,
        }
    }
}

export default SettingsScreen;