import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GameScreen = () => {
  const navigation = useNavigation();

  const games = [
    { name: 'Sudoku', route: 'SudokuGame' },
    { name: 'Memory Game', route: 'MemoryGame' },
    { name: 'Tic Tac Toe', route: 'TicTacToeGame' },
    { name: 'Number Guess', route: 'NumberGuessGame' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mini Games</Text>
      {games.map((game, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => navigation.navigate(game.route)}
        >
          <Text style={styles.cardText}>{game.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#eee',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardText: { fontSize: 18, fontWeight: '600' },
});
