
import React from 'react';

function Button({ color, onClick, children }) {
  return (
    <button
      className={`ma2 pa2 br2 ${color}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
