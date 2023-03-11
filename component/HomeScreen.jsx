import { Button, View, Text, Image, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';

export function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View>
                <Image style={styles.logo} source={require('../assets/Dice-dark-logo.png')} />
            </View>
            <View style={styles.quiz}>
                <Text>ARE U READY FOR THE QUIZ ?</Text>
                <Button style={styles.button}
                    title="Go to Quiz"
                    color="#e9bd1f"
                    onPress={() => navigation.navigate('Quiz')}
                />
                {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Quiz')}>
                <Text>Press Here</Text>
            </TouchableOpacity> */}
            </View>
            <View>
                <Text>If you want more informations about Dice you can go to the website</Text>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
        // justifyContent: 'center',
    },
    quiz: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        // alignItems: 'center',
        // justifyContent: 'center',
        width: 300,
        height: 200
    },
    button: {
        // color: 'yellow',
        // backgroundColor: 'yellow',
        // padding: 10
    }
});

export default HomeScreen;