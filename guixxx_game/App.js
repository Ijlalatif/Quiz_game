import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import axios from 'axios';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        'https://opentdb.com/api.php?amount=5&category=9&type=multiple'
      );
      setQuestions(response.data.results);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const correctAnswer = questions[currentQuestion].correct_answer;
    if (option === correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setQuizFinished(true);
      }
    }, 1000);
  };

  const handleFinishQuiz = () => {
    setQuizFinished(true);
    setShowSummary(true);
  };

  if (showSummary) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.quizFinishedText}>Quiz Summary</Text>
        <Text style={styles.scoreText}>Questions Attempted: {questions.length}</Text>
        <Text style={styles.scoreText}>Correct Answers: {score}</Text>
        <Text style={styles.scoreText}>Incorrect Answers: {questions.length - score}</Text>
        <TouchableOpacity onPress={() => { 
          setShowSummary(false); 
          setQuizFinished(false); 
          setCurrentQuestion(0); 
          setScore(0); 
        }} style={styles.restartButton}>
          <Text style={styles.restartButtonText}>Restart Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (quizFinished) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.quizFinishedText}>Quiz Finished!</Text>
        <TouchableOpacity onPress={handleFinishQuiz} style={styles.restartButton}>
          <Text style={styles.restartButtonText}>Restart Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.centeredView}>
        <Text style={styles.questionCount}>
          Question {currentQuestion + 1}/{questions.length}
        </Text>
        <Text style={styles.questionText}>
          {questions[currentQuestion].question.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}
        </Text>
        {questions[currentQuestion].incorrect_answers.concat(
          questions[currentQuestion].correct_answer
        ).sort().map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleOptionSelect(option)}
            style={[
              styles.optionButton,
              selectedOption
                ? option === questions[currentQuestion].correct_answer
                  ? styles.correctOption
                  : option === selectedOption
                  ? styles.incorrectOption
                  : styles.defaultOption
                : styles.defaultOption
            ]}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        {/* Removed Finish button from here */}
      </View>
    </ScrollView>
  );
}

// Stylesheet for the app
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff', // Light blue background color
    padding: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly opaque white for contrast
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    width: '90%', // Restrict width for better layout
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  questionCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#007BFF',
    textAlign: 'center',
  },
  questionText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic', // Italicize the question for emphasis
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    width: '100%',
    elevation: 3, // Add elevation for a 3D effect
  },
  defaultOption: {
    backgroundColor: '#007BFF', // Blue
  },
  correctOption: {
    backgroundColor: '#28A745', // Green
  },
  incorrectOption: {
    backgroundColor: '#DC3545', // Red
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizFinishedText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  restartButton: {
    backgroundColor: '#FFC107', // Yellow
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    width: '100%',
    elevation: 5, // Add elevation for a 3D effect
  },
  restartButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
