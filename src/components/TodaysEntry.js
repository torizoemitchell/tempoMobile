import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

export default class TodaysEntry extends React.Component {

    tempExists = (props) => {
        return(
            <View>
                <View style={this.styles.container}>
                    <Text style={this.styles.text}>Temp (F): {props.temp}</Text>
                    <Text style={this.styles.text}>Menstruating: {props.flow ? "Yes" : "No"}</Text>
                </View> 
                <View style={this.styles.container}>
                    <Button title="Edit" onPress={this.loginHandler} color="midnightblue" fontFamily="HelveticaNeue-UltraLight" />
                </View>

            </View>
           
          
        )
    }

    tempDoesNotExist = () => {
        return(
            <View>
                <Text>Please record your Temperature for today.</Text>
            </View>
        )
    }

    styles = {
        text: {
            fontSize: 18,
            fontFamily: "HelveticaNeue-Light"
        },
        container: {
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
    
    }

    render(){
        const {
            flow,
            temp
        } = this.props.entry
        console.log("styles: ", styles)
        return (
            <View>
                {(temp != null) ? this.tempExists(this.props.entry) : this.tempDoesNotExist()}
            </View>
        )
    }
}





