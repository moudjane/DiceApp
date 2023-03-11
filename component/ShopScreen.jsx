import React from 'react';
import { FlatList, View } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const games = [
    { name: 'Dobble', image: require('./jeu1.jpg'), price: 12.99 },
    { name: 'Monopoly', image: require('./jeu2.jpg'), price: 22.00 },
    { name: 'Uno', image: require('./jeu3.jpg'), price: 9.99 },
];

function renderGame(game) {
    return (
        <View style={styles.body}>
            <Card key={game.name} style={styles.card}>
                <Card.Cover source={game.image} />
                <Card.Content>
                    <Title>{game.name}</Title>
                    <Paragraph>£{game.price}</Paragraph>
                </Card.Content>
            </Card>
        </View>
    );
}

export function ShopScreen() {
    return (
        <FlatList
            data={games}
            renderItem={({ item }) => renderGame(item)}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5'
    },
    card: {
        marginBottom: 16,
        backgroundColor: 'white'
        // borderBottomColor: '#e9bd1f',
        // borderBottomWidth: 2
    },
});

export default ShopScreen;
