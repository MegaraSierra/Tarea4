import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';

function shuffleArray(array: number[]) {
  const newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const cardBackImage = require('./imagenes/Card0.png');
const cardImages = [
  require('./imagenes/Card1.png'),
  require('./imagenes/Card2.png'),
  require('./imagenes/Card3.png'),
  require('./imagenes/Card4.png'),
  require('./imagenes/Card5.png'),
  require('./imagenes/Card6.png'),
];
const cerebroImage = require('./imagenes/Cerebro.png');
const memoryGameImage = require('./imagenes/MemoryGame.png');

const App: React.FC = () => {
  const [nivel, setNivel] = useState(1);
  const [cards, setCards] = useState<number[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);


  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledCards = shuffleArray([...Array(cardImages.length).keys()]);
    setCards([...shuffledCards, ...shuffledCards]);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setAttempts(0);
  };
  

  const onCardPress = (index: number) => {
    if (flippedIndices.length < 2 && !flippedIndices.includes(index)) {
      setFlippedIndices([...flippedIndices, index]);

      if (flippedIndices.length === 1) {
        setAttempts(attempts + 1);

        if (cards[flippedIndices[0]] === cards[index]) {
          setMatchedPairs([...matchedPairs, cards[index]]);
          checkGameCompletion();
        } else {
          setTimeout(() => setFlippedIndices([]), 1000);
        }
      }
    }
  };

// ...

const checkGameCompletion = () => {

  if (matchedPairs.length === 5) { 
    Alert.alert('¡FELICIDADES GANASTE!', `Número de intentos: ${attempts}`, [
      {
        text: 'Volver a Jugar',
        onPress: () => {
          setNivel(nivel + 1);
          initializeGame();
        },
      },
      { text: 'No', onPress: () => {} },
    ]);
  } else {
    setFlippedIndices([]);
  }
};
  

  
  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(cards[index]);

    return (
      <TouchableOpacity onPress={() => onCardPress(index)}>
        <View style={styles.cardContainer}>
          {isFlipped ? (
            <Image source={cardImages[cards[index]]} style={styles.cardImage} />
          ) : (
            <Image source={cardBackImage} style={styles.cardImage} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Image source={cerebroImage} style={styles.cerebroImage} />

      <View style={styles.levelContainer}>
        <View style={styles.levelCircle}>
          <Text style={styles.levelText}>{nivel}</Text>
        </View>
        <Text style={styles.levelLabel}>Nivel</Text>
      </View>
      <Image source={memoryGameImage} style={styles.memoryGameImage} />
      <View style={styles.cardGrid}>
        {cards.map((_, index) => (
          <View key={index} style={styles.cardWrapper}>
            {renderItem({ item: cards[index], index })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5CB386',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardWrapper: {
    margin: 5,
  },
  cardContainer: {
    width: 80,
    height: 110,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  memoryGameImage: {
    width: 200,
    height: 50,
    marginBottom: 15,
  },
  levelContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: 'white',
    fontSize: 20,
  },
  levelLabel: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },  
  cerebroImage: {
    width: 100, 
    height: 125, 
    marginBottom: 20, 
  },
});

export default App;