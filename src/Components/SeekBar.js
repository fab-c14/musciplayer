
import React from 'react';

function SeekBar({ currentTime, duration, seekHandler }) {
  return (
    <div className="seek-bar">
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={seekHandler}
      />
    </div>
  );
}

export default SeekBar;
