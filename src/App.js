import {useState} from 'react';
import Card from './components/Card';
import './Styles/App.css';
import { sampleSize } from 'lodash';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function App() {
  const startingLettersCount = 9;
  const maxLetters = 9;
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  const bestStage = localStorage.getItem("memoryGameBestStage") === null ?
                    0 : localStorage.getItem("memoryGameBestStage")
  const [menuOpen, setMenuOpen] = useState(false);
  const [state, setState] = useState({
    'score':0,
    'lettersCount': startingLettersCount,
    'stage':1,
    'bestStage':bestStage,
    'activeLetters': alphabet.slice(0,startingLettersCount),
    'clickedLetters': [],
    'remainingLetters': alphabet.slice(0,startingLettersCount),
    'sampledLetters': sampleSize(alphabet.slice(0,startingLettersCount), maxLetters)
  });
  const [stageCategory, setStageCategory] = useState("");
  function toggleMenu(event){
    setMenuOpen(!menuOpen);
  }
  function letterClicked(event){
    if (event.target === event.currentTarget) return
    const targetLetter = event.target.nodeName === "P" ? event.target.parentElement.id : event.target.id;

    if (state.clickedLetters.includes(targetLetter)){
      setStageCategory("lose");
      setState(prevState => ({
        ...prevState,
         'score':0,
         'lettersCount':startingLettersCount,
         'stage':1,
         'clickedLetters':[],
         'activeLetters': alphabet.slice(0,startingLettersCount),
         'remainingLetters': alphabet.slice(0,startingLettersCount),
         'sampledLetters': sampleSize(alphabet.slice(0,startingLettersCount), maxLetters)
         }));
         setTimeout(() => {
          setStageCategory("");
        }, 500);   
    } else {
      if (state.score >= state.lettersCount-1){
        setStageCategory("win");
        localStorage.setItem("memoryGameBestStage", state.stage)
        setState(prevState => ({
          ...prevState,
           'score':0,
           'lettersCount':prevState.lettersCount+1,
           'stage':prevState.stage+1,
           'bestStage': prevState.stage,
           'clickedLetters':[],
           'activeLetters': alphabet.slice(0,prevState.lettersCount+1),
           'remainingLetters': alphabet.slice(0,prevState.lettersCount+1),
           'sampledLetters': sampleSize(alphabet.slice(0,prevState.lettersCount+1), maxLetters)
           }));
        setTimeout(() => {
          setStageCategory("");
        }, 500);   
      } else {
        setState(prevState => {
          const score = prevState.score+1;
          const clickedLetters = [...prevState.clickedLetters, targetLetter];
          const remainingLetters = prevState.remainingLetters.filter(letter=> letter !== targetLetter);
          let targetArray = [];
          if (remainingLetters.length >= maxLetters){
            targetArray = remainingLetters;
          } else {
            targetArray = remainingLetters.concat(sampleSize(clickedLetters, maxLetters-remainingLetters.length)) 
          }
          const sampledLetters = sampleSize(targetArray, maxLetters)
          
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
        <button onClick={toggleMenu}><InfoOutlinedIcon/></button>
        {menuOpen && <p id='description'>Tap or click unique letters for the stage. See how many stages you can complete. The stage is complete when all possible letters are clicked. At the end of the stage, the counter is reset, and the next letter in the alphabet is added to the possible letters while keeping the same number of letters on the screen. </p>}
        <h1 id='gameTitle'>DREAD</h1>
        <div id="statsContainer">
        <p id='score'>{`Score: ${state.score}/${state.lettersCount}`}</p>
        <p id='stage'>{`Stage: ${state.stage}`}</p>
        <p id='bestStage'>{`Best Stage: ${state.bestStage}`}</p>
        </div>
      </div>
      <div id='cardsContainer' onClick={letterClicked} className={stageCategory}>
      {state.sampledLetters.map(letterElement => <Card key={letterElement} id={letterElement} letter={letterElement} />)}
      </div>
    </div>
  );
}



export default App;
