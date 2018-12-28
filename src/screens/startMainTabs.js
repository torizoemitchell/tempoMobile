import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

const startTabs = () => {
    Promise.all([
        Icon.getImageSource("ios-calendar", 30),
        Icon.getImageSource("ios-settings", 30)
    ]).then(sources => {
        Navigation.startTabBasedApp({
            tabs: [
                {
                    screen: "tempo-mobile.CalendarScreen",
                    label: "Calendar",
                    title: "Calendar",
                    icon: sources[0]
                },
                {
                    screen: "tempo-mobile.SettingsScreen",
                    label: "Settings",
                    title: "Settings",
                    icon: sources[1]
                }
            ]
        });
    });
};

export default startTabs;