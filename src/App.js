import {useState} from 'react';
import Card from './components/Card';
import './Styles/App.css';
import _ from 'lodash';

function App() {
  const startingLettersCount = 9;
  const maxLetters = 9;
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  const [menuOpen, setMenuOpen] = useState(false);
  const [state, setState] = useState({
    'score':0,
    'lettersCount': startingLettersCount,
    'stage':1,
    'bestStage':1,
    'activeLetters': alphabet.slice(0,startingLettersCount),
    'clickedLetters': [],
    'remainingLetters': alphabet.slice(0,startingLettersCount),
    'sampledLetters': _.sampleSize(alphabet.slice(0,startingLettersCount), maxLetters)
  });
  function toggleMenu(event){
    setMenuOpen(!menuOpen);
  }
  function letterClicked(event){
    if (event.target === event.currentTarget) return
    const targetLetter = event.target.nodeName === "P" ? event.target.parentElement.id : event.target.id;

    if (state.clickedLetters.includes(targetLetter)){
      setState(prevState => ({
        ...prevState,
         'score':0,
         'lettersCount':startingLettersCount,
         'stage':1,
         'clickedLetters':[],
         'activeLetters': alphabet.slice(0,startingLettersCount),
         'remainingLetters': alphabet.slice(0,startingLettersCount),
         'sampledLetters': _.sampleSize(alphabet.slice(0,startingLettersCount), maxLetters)
         }));
    } else {
      if (state.score >= state.lettersCount-1){
        setState(prevState => ({
          ...prevState,
           'score':0,
           'lettersCount':prevState.lettersCount+1,
           'stage':prevState.stage+1,
           'bestStage': prevState.stage,
           'clickedLetters':[],
           'activeLetters': alphabet.slice(0,prevState.lettersCount+1),
           'remainingLetters': alphabet.slice(0,prevState.lettersCount+1),
           'sampledLetters': _.sampleSize(alphabet.slice(0,prevState.lettersCount+1), maxLetters)
           }));
      } else {
        setState(prevState => {
          const score = prevState.score+1;
          const clickedLetters = [...prevState.clickedLetters, targetLetter];
          const remainingLetters = prevState.remainingLetters.filter(letter=> letter !== targetLetter);
          let targetArray = [];
          if (remainingLetters.length >= maxLetters){
            targetArray = remainingLetters;
          } else {
            targetArray = remainingLetters.concat(_.sampleSize(clickedLetters, maxLetters-remainingLetters.length)) 
          }
          const sampledLetters = _.sampleSize(targetArray, maxLetters)
          
          return {
          ...prevState,
           'score':score,
           'clickedLetters':clickedLetters,
           'remainingLetters': remainingLetters,
           'sampledLetters':sampledLetters, 
           }});
      }
    }
  }

  return (
    <div id="App">
      <div id='header'>
        <button className='material-symbols-outlined' onClick={toggleMenu}>info</button>
        {menuOpen && <p id='description'>Tap or click unique letters for the stage. See how many stages you can complete. The stage is complete when all possible letters are clicked. At the end of the stage, the counter is reset, and the next letter in the alphabet is added to the possible letters while keeping the same number of letters on the screen. </p>}
        <h1 id='gameTitle'>Memory</h1>
        <p id='score'>{`Score: ${state.score}/${state.lettersCount}`}</p>
        <p id='stage'>{`Stage: ${state.stage}`}</p>
        <p id='bestStage'>{`Best Stage: ${state.bestStage}`}</p>
      </div>
      <div id='cardsContainer' onClick={letterClicked}>
      {state.sampledLetters.map(letterElement => <Card key={letterElement} id={letterElement} letter={letterElement} />)}
      </div>
    </div>
  );
}



export default App;
