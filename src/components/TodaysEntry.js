import React from 'react';
import { Text, View, TextInput } from 'react-native';
import { Button } from 'native-base'

export default class TodaysEntry extends React.Component {

    tempExists = (props) => {
        return(
            <View>
                <View style={this.styles.container}>
                    <View style={this.styles.tempContainer}>
                        <Text style={this.styles.text}>Temp (F):</Text>
                        <TextInput value={props.temp} style={this.styles.input}/>
                    </View>
                    
                    <Text style={this.styles.text}>Menstruating: {props.flow ? "Yes" : "No"}</Text>
                </View> 
                <View style={this.styles.container}>
                    <Button block light>
                        <Text style={this.styles.buttonText}>Edit</Text>
                    </Button>
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
        buttonText: {
            fontFamily: "HelveticaNeue",
            color: "midnightblue",
            fontSize: 20,
        },
        input: {
            width: "36%",
            borderColor: "grey",
            borderWidth: 1,
            padding: 4,
            margin: 2,
            fontFamily: "HelveticaNeue-Light",
            fontSize: 18
        },
        tempContainer: {
            flexDirection: "row",
            alignItems: "center",
        }
    
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





