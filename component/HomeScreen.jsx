import { Button, View, Text, Image, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { Linking } from 'react-native';


export function HomeScreen({ navigation }) {
    const handlePress = () => {
        Linking.openURL('https://diceboardgamelounge.com/');
    };
    return (
        <ScrollView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../assets/Dice-dark-logo.png')} />
            </View>
            <Text style={styles.text}>Welcome to the <Text style={styles.bold}>DiceApp</Text> !</Text>

            <View style={styles.logoContainer}>
                <Image style={styles.image} source={require('../assets/dicetable.jpg')} />
            </View>

            <View style={styles.website}>
                <Text style={styles.text}>If you want more informations about Dice you can go to the website</Text>
                <Button
                    color="#e9bd1f"
                    title="Go to website"
                    onPress={handlePress} />
            </View>

            <View style={styles.carouselContainer}>
                <Text style={styles.text}>Here you have the latest news at Dice:</Text>
                <ScrollView horizontal={true} pagingEnabled={true}>
                    <Image style={styles.carouselImage} source={require('../assets/dicefront.jpg')} />
                    <Image style={styles.carouselImage} source={require('../assets/dicee.jpg')} />
                    <Image style={styles.carouselImage} source={require('../assets/dicetable.jpg')} />
                </ScrollView>
            </View>

            <View style={styles.quiz}>
                <Text style={styles.text}>ARE U READY FOR THE QUIZ ?</Text>
                <Button style={styles.button}
                    title="Go to Quiz"
                    color="#e9bd1f"
                    onPress={() => navigation.navigate('Quiz')}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5'
    },
    quiz: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 100,
        marginHorizontal: 10,
    },
    button: {},
    carouselContainer: {
        height: 300,
        marginTop: 20,
    },
    carouselImage: {
        width: 300,
        height: 200,
        margin: 2
    },
    image: {
        width: '95%',
        height: 300
    },
    text: {
        fontSize: 18,
        textAlign: "center",
        padding: 18,
    },
    bold: {
        fontWeight: 'bold',
        textAlign: "center",
    },
    website: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default HomeScreen;
