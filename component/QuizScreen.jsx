import { Button, View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';


export function QuizScreen({ navigation, games, questions, credentials }) {
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [isQuizEnded, setIsQuizEnded] = useState(false);
    const [actualQuestion, setActualQuestion] = useState("NO QUESTION !");
    const [questionList, setQuestionList] = useState();
    const [questionNum, setQuestionNum] = useState(0);
    const [userResponses, setUserResponses] = useState({});

    // Set quiz as active
    function startQuiz(questions) {
        setIsQuizStarted(true);
        let list = [];
        let res = chooseQuestions(questions);
        for (let i = 0; i < res.length; i++) {
            list.push({ "question": JSON.stringify(generateQuestion(questions, res[i])), "category": res[i], "position": i })
        }
        setQuestionList(list);

        // questionNum = 0 because at the start of the quiz the first question is always at index 0
        setActualQuestion(list[0].question)
    };

    // Return an array containing all categories from Airtable (~ sorting 'questions' from Airtable)
    function getCategories(questions) {

        // Finds the position the row containing all the different categories
        let allCategories = { "value": 0, "position": 0 }

        for (const [key, value] of Object.entries(questions)) {
            if (Object.keys(value.fields).length > allCategories.value) {
                allCategories.value = Object.keys(value.fields).length
                allCategories.position = key
            };
        };

        // Push all categories that could be found, according to 'allCategoriesPosition'
        let categories = [];
        try { eval(questions[allCategories.position].fields) } catch (err) { return console.log("ERR") }
        for (const [key, value] of Object.entries(questions[allCategories.position].fields)) {
            categories.push(key)
        };
        return categories;
    };

    // Generates a question if a category is given
    function generateQuestion(questions, category) {
        // Creates an array that stores all questions for a defined category
        let questionsArray = [];
        for (const [key, value] of Object.entries(questions)) {
            if (value.fields[category] != undefined) {
                questionsArray.push(value.fields[category])
            };
        };
        // Choose a random question from the list
        return questionsArray[Math.floor(Math.random() * questionsArray.length)];

    };

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
            duplicate.push(rng)
            theQuestions.push(categories[rng])
        }
        return theQuestions;
    };

    // When the user clicks on YES/NO : gets user answer and set next question
    function userAnswer(answer) {

        // Register user's choice
        updateUserPreference(answer)

        // increment the questionNum state
        setQuestionNum(questionNum + 1);

        // set the next question if there is one
        if (questionNum + 1 < questionList.length) {
            setActualQuestion(questionList[questionNum + 1].question);
        } else {
            // console.log("End of quiz");
            setIsQuizEnded(true)
        }
    };

    function updateUserPreference(answer) {
        // questionList[questionNum] : actual {question+category+position}
        let userResp = userResponses;

        // if answer was positive :
        if (answer == 'yes') {

            if (userResp[questionList[questionNum].category]) {
                userResp[questionList[questionNum].category]++;
            }
            else {
                userResp[questionList[questionNum].category] = 1;
            }
        };

        // if answer was negative :
        if (answer == 'no') {

            if (userResp[questionList[questionNum].category]) {
                userResp[questionList[questionNum].category]--;
            }
            else {
                userResp[questionList[questionNum].category] = -1;
            }
        };

        setUserResponses(userResp)
    }

    // Get user answers and recommend game(s)
    function recommendGame(userData, games) {
        let data = userData

        // Deletes user's responses that received too much negative / neutral responses
        for (const [key, value] of Object.entries(data)) {
            if (value <= 0) { delete data[key]; }
        }
        if (Object.keys(data).length === 0) { alert("Too much negative responses !") }

        // Find most appropriate game :
        else {
            findBestGame(data, games);
        }
        setUserResponses(data)
    }

    // Find most appropriate game
    function findBestGame(games) {
        return console.log(typeof (games))
        let data = userResponses;
        let highestScore = 0;
        let bestGameRow = null;

        for (const game of games) {
            let score = 0;
            for (const [category, rank] of Object.entries(userResponses)) {
                if (game.fields.Mechanics.includes(category)) {
                    const categoryValue = game.fields[category];
                    score += rank * parseFloat(categoryValue.replace(",", "."));
                }
            }
            if (score > highestScore) {
                highestScore = score;
                bestGameRow = game;
            }
        }

        console.log(games[bestGameRow].fields.name);
    }

    function reset(questions) {
        setIsQuizStarted(false);
        setIsQuizEnded(false)
        // setActualQuestion("NO QUESTION !");
        // setQuestionList();
        setQuestionNum(0);

        startQuiz(questions)
    };


    return (
        <View>

            {/* Activates the quiz (only when quiz is OFF) */}
            {!isQuizStarted && <Text>Let's find out the best game for you !</Text>}
            {/* {!isQuizStarted && <Text>Please pick some categories below :</Text>} */}


            {!isQuizStarted ? (
                <Button title="Start Quiz" onPress={() => startQuiz(questions)} />
            ) : null}

            {/* Question */}
            {isQuizStarted && !isQuizEnded && <Text>{actualQuestion}</Text>}

            {/* Buttons for when the quiz is ON */}
            {isQuizStarted && !isQuizEnded ? (
                <Button title="YES" onPress={() => userAnswer('yes')} />
            ) : null}
            {isQuizStarted && !isQuizEnded ? (
                <Button title="NO" onPress={() => userAnswer('no')} />
            ) : null}

            {isQuizEnded && <Text>You may like this game :</Text>}
            {isQuizEnded && <Text>{JSON.stringify(userResponses)}</Text>}

            {isQuizEnded ? (
                <Button title="Not satified ? More questions !" onPress={() => { reset(questions); }} />
            ) : null}

            {/* {isQuizEnded ? (
                <Button title="I'm done !" onPress={() => { recommendGame(userResponses, games); }} />
            ) : null} */}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default QuizScreen;