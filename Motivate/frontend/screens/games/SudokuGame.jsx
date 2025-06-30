import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const solutions = [
  [
    [1, 2, 3, 4, 5],
    [5, 3, 1, 2, 4],
    [4, 5, 2, 3, 1],
    [2, 1, 4, 5, 3],
    [3, 4, 5, 1, 2],
  ],
  [
    [2, 3, 4, 5, 1],
    [5, 1, 2, 3, 4],
    [4, 5, 1, 2, 3],
    [3, 2, 5, 4, 1],
    [1, 4, 3, 5, 2],
  ],
  [
    [3, 5, 1, 2, 4],
    [4, 2, 5, 3, 1],
    [1, 3, 4, 5, 2],
    [5, 4, 2, 1, 3],
    [2, 1, 3, 4, 5],
  ],
];

const createInitialBoard = (solution, blanks = 10) => {
  const board = JSON.parse(JSON.stringify(solution));
  let count = 0;
  while (count < blanks) {
    const row = Math.floor(Math.random() * 5);
    const col = Math.floor(Math.random() * 5);
    if (board[row][col] !== '') {
      board[row][col] = '';
      count++;
    }
  }
  return board;
};

const SudokuGame = () => {
  const [solution, setSolution] = useState([]);
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * solutions.length);
    const chosenSolution = solutions[randomIndex];
    const startingBoard = createInitialBoard(chosenSolution, 10);
    setSolution(chosenSolution);
    setBoard(startingBoard);
    setInitialBoard(startingBoard);
  }, []);

  const handleChange = (value, row, col) => {
    const newBoard = [...board];
    newBoard[row][col] = value === '' ? '' : parseInt(value);
    setBoard(newBoard);
  };

  const checkSudoku = () => {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (parseInt(board[row][col]) !== solution[row][col]) {
          Alert.alert('Oops!', 'Bazı hücreler yanlış.');
          return;
        }
      }
    }
    Alert.alert('Tebrikler!', 'Sudoku çözüldü!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5x5 Sudoku</Text>
      <View style={styles.grid}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => {
              const isInitial = initialBoard[rowIndex][colIndex] !== '';
              return (
                <TextInput
                  key={colIndex}
                  style={[styles.cell, isInitial && styles.fixedCell]}
                  value={cell.toString()}
                  editable={!isInitial}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(val) => handleChange(val, rowIndex, colIndex)}
                />
              );
            })}
          </View>
        ))}
      </View>
      <Button title="Kontrol Et" onPress={checkSudoku} />
    </View>
  );
};

export default SudokuGame;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  grid: { marginBottom: 20 },
  row: { flexDirection: 'row' },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 18,
    margin: 2,
    backgroundColor: '#fff',
  },
  fixedCell: {
    backgroundColor: '#ddd',
    color: 'black',
    fontWeight: 'bold',
  },
});
