import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import startMainTabs from './startMainTabs';
import { Button } from 'native-base'

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
                <Image source={require('../../assets/flowerwreath.png')} style={styles.logo}/>
                <Text style={styles.brand}>Tempo</Text>
                <View style={styles.inputContainer}>
                    <TextInput placeholder="E-mail Address" style={styles.input} />
                    <TextInput placeholder="Password" style={styles.input} secureTextEntry={true} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button block light onPress={this.loginHandler} style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </Button>
                    <Button block light onPress={this.signUpHandler}style={styles.button}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </Button>
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
        width: "95%",
        borderColor: "grey",
        borderWidth: 1,
        padding: 10,
        margin: 8,
    },
    buttonContainer: {
        width: "78%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"   
    },
    buttonText: {
        fontFamily: "HelveticaNeue",
        color: "midnightblue",
        fontSize: 20,
    },
    button: {
        margin: 2,
        width: "50%"
    },
    brand: {
        fontSize: 60,
        fontFamily: "HelveticaNeue-UltraLight",
        paddingTop: 8,
    },
    logo: {
        width: 190,
        height: 190,
    }
})

export default LoginScreen;