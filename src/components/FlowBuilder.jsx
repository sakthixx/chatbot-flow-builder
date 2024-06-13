import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TextNode from './TextNode';
import NodePanel from './NodePanel'; //Import NodePanel component

const nodeTypes = {
  textNode: TextNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'textNode',
    data: { label: 'Text Node 1' },
    position: { x: 250, y: 5 },
  },
];

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.target.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      const newNode = {
        id: (nodes.length + 1).toString(),
        type,
        position,
        data: { label: `${type} Node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, nodes.length]
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const updateNodeLabel = (label) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          node.data = { ...node.data, label };
        }
        return node;
      })
    );
  };

  const onSave = () => {
    const emptyTargetHandles = nodes.filter(
      (node) => edges.filter((edge) => edge.target === node.id).length === 0
    );

    if (emptyTargetHandles.length > 1) {
      alert('Error: More than one node has an empty target handle.');
    } else {
      console.log('Flow saved:', nodes, edges);
    }
  };

  return (
    <div className="flow-builder">
      <NodePanel onDragStart={(event, nodeType) => event.dataTransfer.setData('application/reactflow', nodeType)} />
      <div className="reactflow-wrapper" style={{ height: 500 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {selectedNode && (
        <div className="settings-panel">
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(event) => updateNodeLabel(event.target.value)}
          />
        </div>
      )}
      <button onClick={onSave}>Save</button>
    </div>
  );
};

export default FlowBuilder;
