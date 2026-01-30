import { useCallback, useEffect, useState } from 'react'
import {wordsList} from './data/words.jsx'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// components
import StartScreen from './components/StartScreen'
import Game from './components/Game.jsx'
import GameOver from './components/GameOver.jsx'
import GameWin from './components/GameWin.jsx'

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
  {id: 4, name: "win"},
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList);
  const totalWords = Object.values(words).flat().length;

  const [pickerWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);
  const [usedWords, setUsedWords] = useState(new Set());

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    let word, category;

    do {
      category = categories[Math.floor(Math.random() * categories.length)];
      const availableWords = words[category].filter(w => !usedWords.has(w.toLowerCase()));
      if (availableWords.length === 0) continue;
      word = availableWords[Math.floor(Math.random() * availableWords.length)];
    } while (!word);

    setUsedWords(prev => new Set(prev).add(word.toLowerCase()));
    return {word, category};
  }, [words, usedWords]);

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  const startGame = useCallback(() => {

    clearLetterStates();

    setGuesses(3);

    const {word, category} = pickWordAndCategory();

    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase();

    if(
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }
    
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  useEffect(() => {

    if(guesses <= 0) {

      clearLetterStates();

      setGameStage(stages[2].name);
    }

  }, [guesses])

  useEffect(() => {

    const uniqueLetters = [... new Set(letters)];

    if(gameStage === 'game' && guessedLetters.length === uniqueLetters.length && uniqueLetters.length > 0) {

      setScore((actualScore) => actualScore + 100);

      startGame();
    }

  }, [guessedLetters, letters, startGame, gameStage]);

  useEffect(() => {
    if (usedWords.size === totalWords && gameStage === 'game') {
      setGameStage(stages[3].name);
    }
  }, [usedWords, gameStage, totalWords]);

  const retry = () => {

    setScore(0);
    setGuesses(3);
    setUsedWords(new Set());

    setGameStage(stages[0].name);
  }

  return (
      <div className='App'>
        {gameStage === 'start' && <StartScreen startGame={startGame} />}
        {gameStage === 'game' && (
          <Game 
            verifyLetter={verifyLetter} 
            pickedWord={pickerWord}
            pickedCategory={pickedCategory}
            letters={letters}
            guessedLetters={guessedLetters} 
            wrongLetters={wrongLetters} 
            guesses={guesses} 
            score={score}
          />
        )}
        {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
        {gameStage === 'win' && <GameWin retry={retry} score={score}/>}
      </div>
  )
}

export default App
