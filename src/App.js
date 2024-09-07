
import { useState } from 'react';
import './App.css';
import PlayScreen from './PlayScreen';
import WaveText from './WaveText';
import { TypeAnimation } from 'react-type-animation';


//https://lospec.com/palette-list/saccharide
//https://lospec.com/palette-list/verdant-valley

function App() {
  const [highscore, setHighscore] = useState(localStorage.getItem("highscore") ?? 0);
  const [page, setPage] = useState("home");


  const startPlaying = () => {
    setPage("play");
  }


  return (
    <div className="font-altima w-100 text-[25px] text-center transition-all" style={{ paddingTop: page == "home" ? "20vh" : 0 }}>
      <WaveText text="TENNER!!!" />
      {page == "home" && (
        <div className='w-3/4 mx-auto'>
          <TypeAnimation
            sequence={[
              1500,
              'Select multiples of tens to score points!',
              3000,
              'Score as many multiples before time runs out!',
              3000,
              'Higher multiples will score more points (20 > 10)',
              3000,
            ]}
            wrapper="span"
            style={{ fontSize: '25px', display: 'inline-block' }}
            deletionSpeed={120}
            repeat={Infinity}
          />
          <div onClick={() => { startPlaying() }} className='bg-[#6a1d39] text-[30px] w-[100px] mx-auto mt-6 leading-[35px] cursor-pointer'>PLAY!</div>
          <div className='text-[#897769]'>Your Highscore: {highscore}</div>
          <div className='mt-10'>Inspired by <a></a></div>
          <div>Game by <a href="http://homek.org">homek</a></div>
        </div>
      )}
      {page == "play" && (
        <PlayScreen />
      )}
    </div>
  );
}

export default App;
