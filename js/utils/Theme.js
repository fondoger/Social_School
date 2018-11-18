import { Platform, StatusBar, Dimensions } from 'react-native';

const _window = Dimensions.get('window');

const Theme = {
    statusBarColor: '#1d7fd1',
    statusBarHeight: (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight),
    headerHeight: 48,
    tabBarHeight: 50,
    screenHeight: _window.height,
    screenWidth: _window.width,
    themeColor: '#2096f3',
    themeColorDeep: '#1872ba',
    themeColorLight: '#53a9ed',
    backgroundColor: '#f2f4f5',
    backgroundColorLight: '#eee',
    backgroundColorDeep: '#e7e9e9',
    headerColorLight: '#fafbfd',
    headerColorLightTint: '#444',
    secondaryColor: '#228f1b',
    lightBackgroundColor: '#f5f5f5',
    activeUnderlayColor: '#c0c0ba',
    btnActiveBackground: '#e0e0e0',
    borderWidth: 0.5,
    borderColor: '#d8d8d8',
    imagePlaceholderColor: '#f3f5f9',
};

const patterns = {
    lightHeaderTintColor: '#444',
    lightHeaderStyle: {
        backgroundColor: '#fff',
        borderBottomWidth:0,
        borderColor:'#ccc',      
        paddingTop: Theme.statusBarHeight,
        height: Theme.headerHeight + Theme.statusBarHeight,
        elevation: 0,
        shadowOpacity: 0,
    }
}

export default { ...Theme, ...patterns };