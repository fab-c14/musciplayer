// components/MusicPlayer.js
import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import SeekBar from './SeekBar';
import '../App.css';
import mp1 from '../Songs/mp1.mp3';
import mp2 from '../Songs/mp2.mp3';
import mp3 from '../Songs/mp3.mp3';
import mp4 from '../Songs/mp4.mp3';


function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [isRepeatActive, setIsRepeatActive] = useState(false);
  const [playlist, setPlaylist] = useState([
    { title: 'Song 1', url: mp1 },
    { title: 'Song 2', url: mp2 },
    { title: 'Song 3', url: mp3 },
    { title: 'Song 4', url: mp4 },
  ]);

  const audioPlayerRef = useRef();

  const currentSong = playlist[currentTrackIndex];

  useEffect(() => {
    const audioPlayer = audioPlayerRef.current;

    // Event listener to update current time
    const updateTime = () => {
      setCurrentTime(audioPlayer.currentTime);
    };

    // Event listener to update duration
    const updateDuration = () => {
      setDuration(audioPlayer.duration);
    };

    // Event listener for when a song ends
    const handleSongEnd = () => {
      if (!repeat) {
        setCurrentTrackIndex((prevIndex) =>
          (prevIndex + 1) % playlist.length
        );
      }
    };

    audioPlayer.addEventListener('timeupdate', updateTime);
    audioPlayer.addEventListener('durationchange', updateDuration);
    audioPlayer.addEventListener('ended', handleSongEnd);

    return () => {
      audioPlayer.removeEventListener('timeupdate', updateTime);
      audioPlayer.removeEventListener('durationchange', updateDuration);
      audioPlayer.removeEventListener('ended', handleSongEnd);
    };
  }, [currentTrackIndex, playlist, repeat]);

  useEffect(() => {
    const audioPlayer = audioPlayerRef.current;

    if (isPlaying) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
      if (repeat) {
        audioPlayer.currentTime = 0; // Reset playback when paused in repeat mode
      }
    }
  }, [isPlaying, repeat]);

  const playPauseHandler = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const skipSongHandler = (direction) => {
    setCurrentTrackIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % playlist.length;
      } else {
        return prevIndex === 0 ? playlist.length - 1 : prevIndex - 1;
      }
    });

    setIsPlaying(repeat); // Start or pause playback based on repeat setting
  };

  const backwardHandler = () => {
    const audioPlayer = audioPlayerRef.current;
    audioPlayer.currentTime -= 10; // Backward by 10 seconds
  };

  const forwardHandler = () => {
    const audioPlayer = audioPlayerRef.current;
    audioPlayer.currentTime += 10; // Forward by 10 seconds
  };

  const volumeChangeHandler = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    audioPlayerRef.current.volume = value;
  };

  const toggleRepeat = () => {
    setRepeat((prevRepeat) => !prevRepeat);
    setIsRepeatActive((prevIsRepeatActive) => !prevIsRepeatActive);
  };

  const seekHandler = (e) => {
    const seekTime = parseFloat(e.target.value);
    audioPlayerRef.current.currentTime = seekTime;
  };

  const addToPlaylistHandler = () => {
    const selectedSong = playlist[currentTrackIndex];
    setPlaylist((prevPlaylist) => [...prevPlaylist, selectedSong]);
  };

  const removeFromPlaylistHandler = (index) => {
    setPlaylist((prevPlaylist) => {
      const newPlaylist = [...prevPlaylist];
      newPlaylist.splice(index, 1);
      return newPlaylist;
    });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={`audio-controls ${isPlaying ? 'playing' : ''}`}>
      <div className="song-info">
        <p className="f4">{currentSong.title}</p>
      </div>
      <div className="controls">
        <Button color="blue" onClick={() => skipSongHandler('previous')}>
          Previous
        </Button>
        <Button color="green" onClick={playPauseHandler}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button color="orange" onClick={backwardHandler}>
          Backward
        </Button>
        <Button color="purple" onClick={forwardHandler}>
          Forward
        </Button>
        <Button color="red" onClick={() => skipSongHandler('next')}>
          Next
        </Button>
       
      </div>
      <div className="additional-controls">
        <Button
          color={isRepeatActive ? 'yellow' : 'light-blue'}
          onClick={toggleRepeat}
        >
          Repeat
        </Button>
        <Button color="light-blue" onClick={addToPlaylistHandler}>
          Add to Playlist
        </Button>
      </div>
      <SeekBar currentTime={currentTime} duration={duration} seekHandler={seekHandler} />
      <div className="time-display">
        <p className="f6">{formatTime(currentTime)}</p>
        <p className="f6">{formatTime(duration)}</p>
      </div>
      <div className="volume-control">
        <label className="f5">Volume:</label>
        <input
          className="w-100"
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={volume}
          onChange={volumeChangeHandler}
          onMouseDown={(e) => e.stopPropagation()} // Prevent seek when adjusting volume
        />
      </div>


     
      <audio ref={audioPlayerRef} src={currentSong.url} />
      <div className="playlist">
        <h2>Playlist</h2>
        <ul>
          {playlist.map((song, index) => (
            <li key={index}>
              {song.title}{' '}
              <Button color="red" onClick={() => removeFromPlaylistHandler(index)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MusicPlayer;
