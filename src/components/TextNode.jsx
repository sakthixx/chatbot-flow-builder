import React from 'react';
import { Handle } from 'reactflow';

const TextNode = ({ data }) => {
  return (
    <div>
      <Handle type="target" position="top" />
      <div>{data.label}</div>
      <Handle type="source" position="bottom" />
    </div>
  );
};

export default TextNode;