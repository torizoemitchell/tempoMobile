import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

export default class TodaysEntry extends React.Component{

    tempExists = (props) => {
        return(
            <View>
                <View style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Text style={{fontSize: 18,
                        fontFamily: "HelveticaNeue-Light"
                    }}>Temp (F): {props.temp}</Text>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: "HelveticaNeue-Light"
                    }}>Menstruating: {props.flow ? "Yes" : "No"}</Text>
                </View> 
                <View style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
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

    render(){
        const {
            flow,
            temp
        } = this.props.entry
        return (
            <View>
                {(temp != null) ? this.tempExists(this.props.entry) : this.tempDoesNotExist()}
            </View>
        )
    }
}

// styles = StyleSheet.create({
//     text: {
//         fontFamily: "HelveticaNeue-UltraLight"
//     }
// })


