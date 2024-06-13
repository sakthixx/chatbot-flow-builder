import React from 'react';

const NodePanel = ({ onDragStart }) => {
  return (
    <aside>
      <div
        className="dndnode text"
        onDragStart={(event) => onDragStart(event, 'textNode')}
        draggable
      >
        Text Node
      </div>
    </aside>
  );
};

export default NodePanel;