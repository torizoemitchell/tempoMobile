import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, Image } from 'react-native';
import startMainTabs from './startMainTabs';

class LoginScreen extends Component {
    loginHandler = () => {
        startMainTabs();
    }

    signUpHandler = () => {
        console.log("Sign Up pressed")
    }
    render() {
        return (
            
            <View style={styles.container}>
                <Text style={styles.brand}>Tempo</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder="E-mail Address" style={styles.input} />
                    <TextInput placeholder="Password" style={styles.input} secureTextEntry="true" />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Login" onPress={this.loginHandler} color="midnightblue" fontFamily="HelveticaNeue-UltraLight"/>
                    <Button title="Sign-Up" onPress={this.signUpHandler} color="midnightblue" fontFamily="HelveticaNeue-UltraLight"/>
                </View>
                
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
    inputContainer: {
        width: "80%",
    },
    input: {
        width: "100%",
        borderColor: "grey",
        borderWidth: 1,
        padding: 10,
        margin: 8,
    },
    buttonContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"      
    },
    brand: {
        fontSize: 60,
        fontFamily: "HelveticaNeue-UltraLight",
    }
})

export default LoginScreen;