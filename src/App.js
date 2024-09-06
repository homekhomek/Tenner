
import './App.css';
import PlayScreen from './PlayScreen';
import WaveText from './WaveText';


//https://lospec.com/palette-list/saccharide
//https://lospec.com/palette-list/verdant-valley

function App() {
  return (
    <div className="font-altima">
      <WaveText text="TENNER!!!" />
      <div className='text-[64px]'>
        <span className='text-[#df9ee9]'>T</span>
        <span className='text-[#dbb54c]'>E</span>
        <span className='text-[#71c1c1]'>N</span>
        <span className='text-[#f6dbc4]'>N</span>
        <span className='text-[#897769]'>E</span>
        <span className='text-[#9e3420]'>R</span>
        <span className='text-[#51473f]'>!</span>
        <span className='text-[#51473f]'>!</span>
        <span className='text-[#51473f]'>!</span>
      </div>

      <PlayScreen />
    </div>
  );
}

export default App;
