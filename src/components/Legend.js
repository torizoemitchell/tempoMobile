import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Legend extends React.Component {

    getRiskStyle = (color) => {
        return {
            fontSize: 18,
            color: color,
        }
    }
    
    render(){
        return (
            <View>
                <View style={this.styles.title}>
                    <Text style={this.styles.titleText}>Risk of Pregnancy Today: </Text>
                    <Text style={this.getRiskStyle(this.props.riskForCurrentDate.color)}>{this.props.riskForCurrentDate.risk}</Text>
                </View>
                
                
                <View style={this.styles.legendRow}>
    
                    <Icon name="circle" size={35} color="#e97a7a" />
                    <View style={this.styles.risk}>
                        <Text style={this.styles.legendText}> Period </Text>
                        <Text style={this.styles.legendText}> Day </Text>
                    </View>
                    
                    <Icon name="circle" size={35} color="#ffcc00" />
                    <View style={this.styles.risk}>
                        <Text style={this.styles.legendText}> Moderate </Text>
                        <Text style={this.styles.legendText}> Risk </Text>
                    </View>

                    
                    <Icon name="circle" size={35} color="#ff8c00" />
                    <View style={this.styles.risk}>
                        <Text style={this.styles.legendText}> High </Text>
                        <Text style={this.styles.legendText}> Risk </Text>
                    </View>

                    <Icon name="circle" size={35} color="#ff4c00" />
                    <View style={this.styles.risk}>
                        <Text style={this.styles.legendText}> Very High </Text>
                        <Text style={this.styles.legendText}> Risk </Text>
                    </View>
                    
                </View>

            </View>
        )
    }

    styles = {
        legendRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        risk: {
            flexDirection: "column",
            alignItems: "center",
            margin: 2
        },
        title: {
            alignItems: "center",
            marginBottom: 8,
            flexDirection: "row",
            justifyContent: "center"
        },
        titleText: {
            fontFamily: "HelveticaNeue-Light",
            fontSize: 18
        },
        legendText: {
            fontFamily: "HelveticaNeue-Light",
            fontSize: 10
        },
        
       
    }

}


