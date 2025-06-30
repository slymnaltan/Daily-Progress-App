import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';

const NumberGuessGame = () => {
  const [randomNumber, setRandomNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    generateNewNumber();
  }, []);

  const generateNewNumber = () => {
    const number = Math.floor(Math.random() * 100) + 1;
    setRandomNumber(number);
    setGuess('');
    setMessage('');
    setAttempts(0);
  };

  const checkGuess = () => {
    const numGuess = parseInt(guess);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      Alert.alert('Uyarı', 'Lütfen 1 ile 100 arasında bir sayı gir.');
      return;
    }

    setAttempts(attempts + 1);
    Keyboard.dismiss();

    if (numGuess === randomNumber) {
      Alert.alert(
        'Tebrikler!',
        `Doğru tahmin ettin! Sayı: ${randomNumber} | Deneme: ${attempts + 1}`,
        [{ text: 'Yeni Oyun', onPress: generateNewNumber }]
      );
    } else if (numGuess < randomNumber) {
      setMessage('Daha büyük bir sayı dene');
    } else {
      setMessage('Daha küçük bir sayı dene');
    }
    setGuess('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sayı Tahmin Oyunu</Text>
      <Text style={styles.subtitle}>1 ile 100 arasında bir sayı tuttum.</Text>
      <TextInput
        style={styles.input}
        placeholder="Tahminini gir"
        keyboardType="numeric"
        value={guess}
        onChangeText={setGuess}
        onSubmitEditing={checkGuess}
      />
      <TouchableOpacity style={styles.button} onPress={checkGuess}>
        <Text style={styles.buttonText}>Tahmin Et</Text>
      </TouchableOpacity>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

export default NumberGuessGame;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '60%',
    padding: 10,
    borderRadius: 8,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3366ff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  message: { marginTop: 20, fontSize: 18 },
});
