import { Button, View, Text, Image } from 'react-native';
import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { parseString } from '../node_modules/react-native-xml2js';

export function QuizScreen({ navigation, games, questions, credentials }) {
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [isQuizEnded, setIsQuizEnded] = useState(false);
    const [actualQuestion, setActualQuestion] = useState("NO QUESTION !");
    const [questionList, setQuestionList] = useState();
    const [questionNum, setQuestionNum] = useState(0);
    const [userResponses, setUserResponses] = useState({});
    const [imageUrl, setImageUrl] = useState("https://cf.geekdo-images.com/c_87h8o0AOrfCO3hxMjjrA__thumb/img/OPNd-zRznLHOLfNDIN8rdhSMHPM=/fit-in/200x150/filters:strip_icc()/pic2349732.jpg")

    const [isSettingNumPlayers, setIsSettingNumPlayers] = useState(false);
    const [numPlayers, setNumPlayers] = useState(0);

    const [isSettingTime, setIsSettingTime] = useState(false);
    const [time, SetTime] = useState(0);

    const [recommendedGame, setRecommendedGame] = useState(false);

    // Set quiz as active
    function startQuiz(questions) {
        setIsQuizStarted(true);
        let list = [];
        let res = chooseQuestions(questions);
        for (let i = 0; i < res.length; i++) {
            list.push({
                question: JSON.stringify(generateQuestion(questions, res[i])),
                category: res[i],
                position: i,
            });
        }
        setQuestionList(list);

        // questionNum = 0 because at the start of the quiz the first question is always at index 0
        setActualQuestion(list[0].question);
        if (Object.keys(userResponses).length === 0) {
            setIsSettingNumPlayers(true);
        }
    }

    // Return an array containing all categories from Airtable (~ sorting 'questions' from Airtable)
    function getCategories(questions) {
        // Finds the position the row containing all the different categories
        let allCategories = { value: 0, position: 0 };

        for (const [key, value] of Object.entries(questions)) {
            if (Object.keys(value.fields).length > allCategories.value) {
                allCategories.value = Object.keys(value.fields).length;
                allCategories.position = key;
            }
        }

        // Push all categories that could be found, according to 'allCategoriesPosition'
        let categories = [];
        try {
            eval(questions[allCategories.position].fields);
        } catch (err) {
            return console.log("ERR");
        }
        for (const [key, value] of Object.entries(
            questions[allCategories.position].fields
        )) {
            categories.push(key);
        }
        return categories;
    }

    // Generates a question if a category is given
    function generateQuestion(questions, category) {
        // Creates an array that stores all questions for a defined category
        let questionsArray = [];
        for (const [key, value] of Object.entries(questions)) {
            if (value.fields[category] != undefined) {
                questionsArray.push(value.fields[category]);
            }
        }
        // Choose a random question from the list
        return questionsArray[Math.floor(Math.random() * questionsArray.length)];
    }

    // Return an array of [{ category + question }]
    function chooseQuestions(questions) {
        let categories = getCategories(questions);
        let qtOfQuestions = 10;
        let duplicate = [];
        let theQuestions = [];

        for (let i = 0; i < qtOfQuestions; i++) {
            let rng = Math.floor(Math.random() * categories.length);
            while (duplicate.includes(rng)) {
                rng = Math.floor(Math.random() * categories.length);
            }
            duplicate.push(rng);
            theQuestions.push(categories[rng]);
        }
        return theQuestions;
    }

    // When the user clicks on YES/NO : gets user answer and set next question
    function userAnswer(answer) {
        // Register user's choice
        updateUserPreference(answer);

        // increment the questionNum state
        setQuestionNum(questionNum + 1);

        // set the next question if there is one
        if (questionNum + 1 < questionList.length) {
            setActualQuestion(questionList[questionNum + 1].question);
        } else {
            // console.log("End of quiz");
            setIsQuizEnded(true);
            recommendGame(userResponses);
        }
    }

    function updateUserPreference(answer) {
        // questionList[questionNum] : actual {question+category+position}
        let userResp = userResponses;

        // if answer was positive :
        if (answer == "yes") {
            if (userResp[questionList[questionNum].category]) {
                userResp[questionList[questionNum].category]++;
            } else {
                userResp[questionList[questionNum].category] = 1;
            }
        }

        // if answer was negative :
        if (answer == "no") {
            if (userResp[questionList[questionNum].category]) {
                userResp[questionList[questionNum].category]--;
            } else {
                userResp[questionList[questionNum].category] = -1;
            }
        }

        setUserResponses(userResp);
    }

    // Get user answers and recommend game(s)
    function recommendGame(userData, games) {
        let data = userData;

        // Deletes user's responses that received too much negative / neutral responses
        for (const [key, value] of Object.entries(data)) {
            if (value <= 0) {
                delete data[key];
            }
        }
        if (Object.keys(data).length === 0) {
            alert("Too much negative responses !");
        }

        // Find most appropriate game :
        else {
            findBestGame(data, games);
        }
        setUserResponses(data);
    }

    // Find most appropriate game
    function findBestGame(userResponses) {
        let bestGame = null;
        let bestScore = -1;

        let options = {};

        if (numPlayers != 0) {
            if (numPlayers == 1) {
                options.players = 1;
            }
            if (numPlayers == 2) {
                options.players = 2;
            }
            if (numPlayers == 3) {
                options.players = 3;
            }
            if (numPlayers == 4) {
                options.players = 4;
            }
        }
        if (time != 0) {
            if (time == 1) {
                options.time = 30;
            }
            if (time == 2) {
                options.time = 60;
            }
            if (time == 3) {
                options.time = 120;
            }
            if (time == 4) {
                options.time = 30;
            }
        }

        let bestGames = [];

        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            const fields = game.fields;
            let score = 0;

            // Check if game matches each category and add to score if it does
            for (const category in userResponses) {
                if (
                    (fields[category] || fields["Mechanics"].includes(category)) &&
                    fields["Min Players"] == options.players &&
                    fields["Play Time"] == options.time
                ) {
                    score += userResponses[category] ? userResponses[category] : 0.5;
                }
            }

            // Update best game list if this game has a higher score
            if (score > bestScore) {
                bestGames = [game];
                bestScore = score;
            } else if (score == bestScore) {
                bestGames.push(game);
            }
        }

        // Randomly select a game from the list of best games
        const randomIndex = Math.floor(Math.random() * bestGames.length);
        bestGame = bestGames[randomIndex];

        setRecommendedGame(bestGame);
        getGameImage(bestGame.fields.ID)
    }

    function getGameImage(gameId) {
        // Make a request to the API for the game ID
        axios.get(`https://www.boardgamegeek.com/xmlapi/boardgame/${gameId}`)
            .then(response => {
                // Parse the XML data using react-native-xml2js
                parseString(response.data, (err, result) => {
                    if (err) {
                        console.error(`Error parsing XML data: ${err}`);
                        return;
                    }
                    // Find the <image> tag and extract its content
                    imageContent = result.boardgames.boardgame[0].image[0];
                    // Set the state with the image content
                    setImageUrl(imageContent)
                });
            })
            .catch(error => {
                console.error(`Error retrieving data for game ID ${gameId}: ${error}`);
            });
    }

    function reset(questions) {
        setIsQuizStarted(false);
        setIsQuizEnded(false);
        // setActualQuestion("NO QUESTION !");
        // setQuestionList();
        setQuestionNum(0);

        startQuiz(questions);
    }

    function completeReset() {
        setIsQuizStarted(false);
        setIsQuizEnded(false);
        setActualQuestion("NO QUESTION !");
        setQuestionList();
        setQuestionNum(0);
        setUserResponses({});
        setIsSettingNumPlayers(false);
        setNumPlayers(0);
        setIsSettingTime(false);
        SetTime(0);
        setRecommendedGame(false);
    }

    return (
        <View style={styles.container}>
            {/* Activates the quiz (only when quiz is OFF) */}
            {!isQuizStarted && (
                <Text style={styles.text}>Let's find out the best game for you !</Text>
            )}
            {/* {!isQuizStarted && <Text>Please pick some categories below :</Text>} */}

            {!isQuizStarted ? (
                <Button
                    title="Start Quiz"
                    color="#e9bd1f"
                    onPress={() => startQuiz(questions)}
                />
            ) : null}

            {/* Question */}
            {isQuizStarted &&
                !isQuizEnded &&
                !isSettingNumPlayers &&
                !isSettingTime && <Text style={styles.text}>{actualQuestion}</Text>}

            <View style={styles.btnyesno}>
                {/* Buttons for when the quiz is ON */}
                {isQuizStarted &&
                    !isQuizEnded &&
                    !isSettingNumPlayers &&
                    !isSettingTime ? (
                    <Button
                        title="YES"
                        color="#e9bd1f"
                        onPress={() => userAnswer("yes")} />
                ) : null}
                {isQuizStarted &&
                    !isQuizEnded &&
                    !isSettingNumPlayers &&
                    !isSettingTime ? (
                    <Button
                        title="NO"
                        color="#e9bd1f"
                        onPress={() => userAnswer("no")} />
                ) : null}
            </View>

            {/* How many players */}
            {isQuizStarted &&
                !isQuizEnded &&
                isSettingNumPlayers &&
                !isSettingTime && (
                    <Text style={styles.text}>How many players are you ?</Text>
                )}

            <View style={styles.btn4}>
                <View style={styles.btnduo}>
                    <View style={styles.btnsolo}>
                        {isQuizStarted &&
                            !isQuizEnded &&
                            isSettingNumPlayers &&
                            !isSettingTime ? (
                            <Button
                                title="1 player"
                                color="#e9bd1f"
                                onPress={() => {
                                    setNumPlayers(1);
                                    setIsSettingNumPlayers(false);
                                    setIsSettingTime(true);
                                }}
                            />
                        ) : null}
                    </View>

                    {isQuizStarted &&
                        !isQuizEnded &&
                        isSettingNumPlayers &&
                        !isSettingTime ? (
                        <Button
                            title="2 players"
                            color="#e9bd1f"
                            onPress={() => {
                                setNumPlayers(2);
                                setIsSettingNumPlayers(false);
                                setIsSettingTime(true);
                            }}
                        />
                    ) : null}
                </View>
                <View style={styles.btnduo}>
                    <View style={styles.btnsolo}>

                        {isQuizStarted &&
                            !isQuizEnded &&
                            isSettingNumPlayers &&
                            !isSettingTime ? (
                            <Button
                                title="3 players"
                                color="#e9bd1f"
                                onPress={() => {
                                    setNumPlayers(3);
                                    setIsSettingNumPlayers(false);
                                    setIsSettingTime(true);
                                }}
                            />
                        ) : null}
                    </View>


                    {isQuizStarted &&
                        !isQuizEnded &&
                        isSettingNumPlayers &&
                        !isSettingTime ? (
                        <Button
                            title="4+ players"
                            color="#e9bd1f"
                            onPress={() => {
                                setNumPlayers(4);
                                setIsSettingNumPlayers(false);
                                setIsSettingTime(true);
                            }}
                        />
                    ) : null}
                </View>
            </View>

            {/* How many time */}
            {isQuizStarted &&
                !isQuizEnded &&
                !isSettingNumPlayers &&
                isSettingTime && (
                    <Text style={styles.text}>How many time do you have ?</Text>
                )}
            <View style={styles.btn4}>
                <View style={styles.btnduo}>
                    <View style={styles.btnsolo}>
                        {isQuizStarted &&
                            !isQuizEnded &&
                            !isSettingNumPlayers &&
                            isSettingTime ? (
                            <Button
                                title="30 minutes"
                                color="#e9bd1f"
                                onPress={() => {
                                    setNumPlayers(1);
                                    setIsSettingTime(false);
                                }}
                            />
                        ) : null}
                    </View>
                    {isQuizStarted &&
                        !isQuizEnded &&
                        !isSettingNumPlayers &&
                        isSettingTime ? (
                        <Button
                            title="1 hour"
                            color="#e9bd1f"
                            onPress={() => {
                                setNumPlayers(2);
                                setIsSettingTime(false);
                            }}
                        />
                    ) : null}
                </View>

                <View style={styles.btnduo}>
                    <View style={styles.btnsolo}>
                        {isQuizStarted &&
                            !isQuizEnded &&
                            !isSettingNumPlayers &&
                            isSettingTime ? (
                            <Button
                                title="2 hours"
                                color="#e9bd1f"
                                onPress={() => {
                                    setNumPlayers(3);
                                    setIsSettingTime(false);
                                }}
                            />
                        ) : null}
                    </View>
                    {isQuizStarted &&
                        !isQuizEnded &&
                        !isSettingNumPlayers &&
                        isSettingTime ? (
                        <Button
                            title="2+ hours"
                            color="#e9bd1f"
                            onPress={() => {
                                setNumPlayers(4);
                                setIsSettingTime(false);
                            }}
                        />
                    ) : null}
                </View>
            </View>

            {isQuizEnded && recommendedGame && (
                <Text style={styles.text2}>You may like this game :</Text>
            )}
            {isQuizEnded && recommendedGame && (
                <Text style={styles.title}>
                    {JSON.stringify(recommendedGame.fields.Name)}
                </Text>
            )}

            {isQuizEnded && recommendedGame && <Image
                source={{ uri: imageUrl }}
                style={{ width: 250, height: 200, resizeMode: "contain" }}
            />}

            <View style={styles.btnyesno2}>
                <View style={styles.btnduo}>
                    <View style={styles.btnsolo}>
                        {isQuizEnded ? (
                            <Button
                                title="Not satisfied ? More questions !"
                                color="red"
                                onPress={() => {
                                    reset(questions);
                                }}
                            />
                        ) : null}
                    </View>
                    {isQuizEnded ? (
                        <Button
                            title="Restart quiz"
                            color="blue"
                            onPress={() => {
                                completeReset();
                            }}
                        />
                    ) : null}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 20,
        marginHorizontal: 16,
    },
    btnstart: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 18,
    },
    text: {
        fontSize: 18,
        textAlign: "center",
        padding: 18,
    },
    text2: {
        fontSize: 18,
        textAlign: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    btnyesno: {
        width: "30%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    btnyesno2: {
        width: "70%",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    btn4: {
        width: "70%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    btnduo: {
        marginBottom: 6,
        padding: 10
    },
    btnsolo: {
        paddingBottom: 20
    }

});

export default QuizScreen;