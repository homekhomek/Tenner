
import { useState, useEffect } from 'react';
import './App.css';
import PlayScreen from './PlayScreen';
import WaveText from './WaveText';
import { TypeAnimation } from 'react-type-animation';


//https://lospec.com/palette-list/saccharide
//https://lospec.com/palette-list/verdant-valley

function App() {
  const [highscore, setHighscore] = useState(localStorage.getItem("highscore") ?? 0);
  const [page, setPage] = useState("home");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);

  useEffect(() => {
    // Check if the device supports touch events
    const checkTouchDevice = () => setIsTouchDevice('ontouchstart' in window);

    checkTouchDevice();
    // Optionally, you can listen to window resize events to handle device changes
    window.addEventListener('resize', checkTouchDevice);

    return () => {
      window.removeEventListener('resize', checkTouchDevice);
    };
  }, []);

  const startPlaying = () => {
    setPage("play");
  }


  const backToMain = () => {
    setNewHighScore(false);
    setPage("home");
  }

  const gameOva = (score) => {
    console.log(highscore)
    setLastScore(score);

    if (score > highscore) {
      localStorage.setItem("highscore", score);
      setHighscore(score);
      setNewHighScore(true);

    }

    setPage("end");
  }

  return (
    <div className="font-altima w-100 text-[25px] text-center transition-all" style={{ paddingTop: page != "play" ? "20vh" : 0 }}>
      <WaveText text="TENNER!!!" colored={true} />
      {page == "end" && (
        <div className='w-3/4 mx-auto'>
          <div className='text-[50px] leading-[30px]'>You Scored <b className='text-[#9e3420]'> {lastScore}</b> Points!</div>
          {newHighScore && (
            <div className='text-[#8fbb4e]'><WaveText text="New-High-Score!!" size={30} colored={false} /></div>
          )}

          <div className='text-[30px] leading-[20px] mt-4'>Good job, although I'd bet you could do better &gt;:&#41;</div>
          <div onClick={() => { backToMain() }} className='bg-[#6a1d39] text-[30px] w-[100px] mx-auto mt-6 leading-[35px] cursor-pointer'>Back</div>
          <div className='mt-10'>Inspired by <a className='underline text-[#8b6be3]' href='https://en.gamesaien.com/game/fruit_box/'>FruitBox</a></div>
          <div>Game by <a className='underline text-[#8b6be3]' href="http://homek.org">homek</a></div>
        </div>
      )}
      {page == "home" && (
        <div className='w-3/4 mx-auto'>
          <TypeAnimation
            sequence={[
              1500,
              'Select groups of ten to score points!',
              3000,
              'Score as many tens before time runs out!',
              3000,
              'Bigger boxes will give more points!',
              3000,
            ]}
            wrapper="span"
            style={{ fontSize: '25px', display: 'inline-block' }}
            deletionSpeed={120}
            repeat={Infinity}
          />
          <div onClick={() => { startPlaying() }} className='bg-[#6a1d39] text-[30px] w-[100px] mx-auto mt-6 leading-[35px] cursor-pointer'>PLAY!</div>
          <div className='text-[#897769]'>Your Highscore: {highscore}</div>
          <div className='mt-10'>Inspired by <a className='underline text-[#8b6be3]' href='https://en.gamesaien.com/game/fruit_box/'>FruitBox</a></div>
          <div>Game by <a className='underline text-[#8b6be3]' href="http://homek.org">homek</a></div>
        </div>
      )}
      {page == "play" && (
        <PlayScreen
          gameOverCallback={gameOva}
          isTouchDevice={isTouchDevice} />
      )}
    </div>
  );
}

export default App;
