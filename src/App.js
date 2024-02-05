// App.js
import React from 'react';
import 'tachyons/css/tachyons.min.css';
import './App.css';
import MusicPlayer from './Components/MusicPlayer';

function App() {
  return (
    <div className="App tc">
      <h1 className="f2">Simple Music Player</h1>
      <MusicPlayer />
    </div>
  );
}

export default App;
