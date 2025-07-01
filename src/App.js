import React, { useState } from 'react';
import './App.css';
import Chicken from "./assets/lava_chicken.jpg"
import Banana from "./assets/banana.jpg"

function randomizedBoard(){
  //To make 50/50 randomized images
  const images = Array(18).fill({type: 'chicken', img: Chicken}).concat(Array(18).fill({type: 'banana', img: Banana}));

  //Fisher-Yates (or Knuth) shuffle algorithm from chatgtp :(
  for(let i = images.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }
  return images;
}


function App() {
  const [imges, setImages] = useState(randomizedBoard());
  //To reveal the imgs
  const [revealed, setRevealed] = useState(Array(36).fill(false));
  const [player, setPlayer] = useState('chicken');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [scores, setScore] = useState({chicken: 0, banana:0})

  const chickenLeft = imges.filter((tile, i) => tile.type === 'chicken' && !revealed[i]).length;
  const bananaLeft = imges.filter((tile, i) => tile.type === 'banana' && !revealed[i]).length;

  function handleClick(click){
    if (gameOver || revealed[click]) return;
    const updateRevealed = [revealed];
    updateRevealed[click] = true;
    setRevealed(updateRevealed);

    if (imges[click].type === player){
      const updateRevealed = [revealed];
      updateRevealed[click] = true;
      setRevealed(updateRevealed);
      
      if (player === 'chicken' && chickenLeft === 1){
        setGameOver(true);
        setWinner('Chicken Player')
        setScore(prev => ({prev, chicken: prev.chicken + 1}));
      }
      else if(player === 'banana' && chickenLeft === 1){
        setGameOver(true);
        setWinner('Banana Player')
        setScore(prev => ({prev, banana: prev.banana + 1}));
      } 
      else{
        setPlayer(player === "chicken" ? "banana" : "chicken");
      }
    }else{
      setGameOver(true);
      const winPlayer = player === 'chicken' ? 'Banana Player' : 'Chicken Player';
      setWinner(winPlayer);
      setScore(prev => player === 'chicken' ? {prev, banana: prev.banana + 1} : {prev, chicken: prev.chicken + 1});   
    }
  }

  function restart(){
    setImages(randomizedBoard());
    setRevealed(Array(36).fill(false));
    setGameOver(false);
    setWinner('');
    setPlayer('chicken');
  }

  return (
    <div className='Container'>
      <h1>
        <span className = "chicken-header" > Chicken</span>
        <span className='banana-header'>Banana</span>
      </h1>
      <div>
        <b>Score:</b>
        <span> Chicken: {scores.chicken}</span>
        <span> | </span>
        <span> Banana: {scores.banana}</span>
      </div>
      <p>
            Two players: <b>Chicken</b> and <b>Banana</b>.<br />
            {gameOver
            ? <span className='winner'>{winner} wins!</span>
            : <>Current turn: <b>{player.charAt(0).toUpperCase() + player.slice(1)} Player</b></>
            }
        </p>
        <div className='grid'>
            {imges.map((tile, idx) => (
            <button
                key={idx}
                className="square"
                style={{
                    width: 60,
                    height: 60,
                    background: revealed[idx] ? '#f0f0f0' : '#ddd',
                    border: '2px solid #000000',
                    cursor: gameOver || revealed[idx] ? 'not-allowed' : 'pointer',
                    padding: 0,
                }}
                onClick={() => handleClick(idx)}
                disabled={gameOver || revealed[idx]}
            >
                {revealed[idx] ? (
                <img
                src={tile.img}
                alt={tile.type}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
                />
                ) : (
                <span style={{ fontSize: 18 }}>{idx + 1}</span>
                )}
            </button>
            ))}
        </div>
        <button className = 'restart' onClick={restart}>Restart Game</button>
    </div>
  );
}

export default App;