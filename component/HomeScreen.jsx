import { Button, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';

export function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View>
                <Image style={styles.logo} source={require('../assets/Dice-dark-logo.png')} />

            </View>

            <View>
                <Text>If you want more informations about Dice you can go to the website</Text>
            </View>
            <View style={styles.carouselContainer}>
                <Text>Here you have the latest news at Dice:</Text>
                <ScrollView horizontal={true} pagingEnabled={true}>
                    <Image style={styles.carouselImage} source={require('../assets/jeu1.jpg')} />
                    <Image style={styles.carouselImage} source={require('../assets/dicee.jpg')} />
                    <Image style={styles.carouselImage} source={require('../assets/jeu1.jpg')} />
                </ScrollView>
            </View>
            <View style={styles.quiz}>
                <Text>ARE U READY FOR THE QUIZ ?</Text>
                <Button style={styles.button}
                    title="Go to Quiz"
                    color="#e9bd1f"
                    onPress={() => navigation.navigate('Quiz')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    quiz: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 300,
        height: 200
    },
    button: {},
    carouselContainer: {
        height: 200,
        marginTop: 20,
    },
    carouselImage: {
        width: 300,
        height: 200,
    },
});

export default HomeScreen;
