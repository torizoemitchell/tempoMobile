import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

const startTabs = () => {
    Promise.all([
        Icon.getImageSource("md-map", 30),
        Icon.getImageSource("ios-share-alt", 30)
    ]).then(sources => {
        Navigation.startTabBasedApp({
            tabs: [
                {
                    screen: "tempo-mobile.CalendarScreen",
                    label: "Calendar Page",
                    title: "Calendar Page",
                    icon: sources[0]
                },
                {
                    screen: "tempo-mobile.SettingsScreen",
                    label: "SettingsScreen",
                    title: "SettingsScreen",
                    icon: sources[1]
                }
            ]
        });
    });
};

export default startTabs;