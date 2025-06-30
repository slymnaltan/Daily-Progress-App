import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const emptyBoard = Array(3).fill(null).map(() => Array(3).fill(''));

const XOXGame = () => {
  const [board, setBoard] = useState(emptyBoard);
  const [gameOver, setGameOver] = useState(false);

  const checkWinner = (b) => {
    // Satır, sütun ve çapraz kontrolü
    for (let i = 0; i < 3; i++) {
      if (b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return b[i][0];
      if (b[0][i] && b[0][i] === b[1][i] && b[1][i] === b[2][i]) return b[0][i];
    }
    if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0];
    if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2];
    return null;
  };

  const isBoardFull = (b) => b.flat().every(cell => cell !== '');

  const makeComputerMove = (newBoard) => {
    if (gameOver) return;

    // Bilgisayar için boş hücreleri bul
    const emptyCells = [];
    newBoard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === '') emptyCells.push({ rowIndex, colIndex });
      });
    });

    if (emptyCells.length === 0) return;

    // Rastgele boş bir hücre seç
    const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    newBoard[move.rowIndex][move.colIndex] = 'O';
    setBoard([...newBoard]);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      Alert.alert(
        winner === 'X' ? 'Kazandın!' : 'Kaybettin!',
        winner === 'X' ? 'Harika iş!' : 'Daha iyi oynayabilirsin.'
      );
    } else if (isBoardFull(newBoard)) {
      setGameOver(true);
      Alert.alert('Berabere!', 'Oyun bitti, kimse kazanmadı.');
    }
  };

  const handlePress = (row, col) => {
    if (gameOver || board[row][col] !== '') return;

    const newBoard = [...board.map(r => [...r])];
    newBoard[row][col] = 'X';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      Alert.alert('Kazandın!', 'Harika iş!');
    } else if (isBoardFull(newBoard)) {
      setGameOver(true);
      Alert.alert('Berabere!', 'Kimse kazanmadı.');
    } else {
      // 0.5 saniye sonra bilgisayar oynasın
      setTimeout(() => makeComputerMove(newBoard), 500);
    }
  };

  const resetGame = () => {
    setBoard(emptyBoard.map(r => r.map(() => '')));
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>XOX (Tic Tac Toe)</Text>
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={styles.cell}
                onPress={() => handlePress(rowIndex, colIndex)}
              >
                <Text style={styles.cellText}>{cell}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      {gameOver && (
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetText}>Yeniden Oyna</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default XOXGame;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  board: { borderWidth: 2 },
  row: { flexDirection: 'row' },
  cell: {
    width: 80,
    height: 80,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: { fontSize: 32, fontWeight: 'bold' },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  resetText: { color: 'white', fontSize: 16 },
});
