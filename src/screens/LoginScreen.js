import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

import startMainTabs from './startMainTabs';

class LoginScreen extends Component {
    loginHandler = () => {
        startMainTabs();
    }

    render() {
        return (
            <View>
                <Text>Login Screen</Text>
                <Button title="Login" onPress={this.loginHandler} />
            </View>
        );
    }
}

export default LoginScreen;