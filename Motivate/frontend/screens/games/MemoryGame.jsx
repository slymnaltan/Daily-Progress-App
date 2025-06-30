import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const emojis = ['🐶', '🐱', '🐻', '🐸', '🦊', '🐼'];

const shuffleCards = () => {
  const duplicated = [...emojis, ...emojis];
  for (let i = duplicated.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [duplicated[i], duplicated[j]] = [duplicated[j], duplicated[i]];
  }
  return duplicated.map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
};

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setCards(shuffleCards());
  }, []);

  // 🧠 Oyun tamamlanınca alert göster
  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every((c) => c.isMatched);
    if (allMatched) {
      setTimeout(() => {
        Alert.alert("🎉 Tebrikler!", "Tüm kartları eşleştirdin!", [
          { text: "Yeniden Oyna", onPress: () => restartGame() }
        ]);
      }, 300);
    }
  }, [cards]);

  const handlePress = (card) => {
    if (card.isFlipped || card.isMatched || selected.length === 2) return;

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    const updatedSelected = [...selected, card];

    setCards(updatedCards);
    setSelected(updatedSelected);

    if (updatedSelected.length === 2) {
      const [first, second] = updatedSelected;
      if (first.emoji === second.emoji) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.emoji === first.emoji ? { ...c, isMatched: true } : c
            )
          );
          setSelected([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first.id || c.id === second.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelected([]);
        }, 800);
      }
    }
  };

  const restartGame = () => {
    setCards(shuffleCards());
    setSelected([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Memory Game</Text>
      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              card.isFlipped || card.isMatched ? styles.cardFlipped : styles.cardHidden,
            ]}
            onPress={() => handlePress(card)}
          >
            <Text style={styles.cardText}>
              {card.isFlipped || card.isMatched ? card.emoji : "?"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 320,
  },
  card: {
    width: 60,
    height: 60,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  cardText: { fontSize: 28 },
  cardHidden: { backgroundColor: '#aaa' },
  cardFlipped: { backgroundColor: '#66ccff' },
});
