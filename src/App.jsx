import { useState, useRef, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  updateEdge,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";

import Sidebar from "./components/Sidebar.jsx";

import "./index.css";
import WhatsAppNode from "./components/WhatsAppNode.jsx";

const initialNodes = [];
const nodeTypes = {
  selectorNode: WhatsAppNode,
};

let id = 0;
const getId = () => `${id++}`;

const App = () => {
  const edgeUpdateSuccessful = useRef(true);

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null); // State to store the selected node

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type: "selectorNode", // Ensure the node type is WhatsAppNode
        position,
        data: { label: `test message ${id}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);
  const onNodeClick = useCallback((event, element) => {
    setSelectedNode(element);
  }, []);
  const handleUpdateLabel = (id, newLabel) => {
    // Update logic using setNodes here

    const updatedNodes = [...nodes];
    console.log(id);
    const targetIndex = updatedNodes.findIndex((node) => {
      console.log(node);
      return node.id === id;
    });

    if (targetIndex !== -1) {
      updatedNodes[targetIndex] = {
        ...updatedNodes[targetIndex],
        data: { ...updatedNodes[targetIndex].data, label: newLabel },
      };
    }
    setNodes(updatedNodes);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          borderBottom: "1px solid black",
          paddingBottom: "10px",
        }}
      >
        <div
          className="dndnode input"
          style={{
            border: "2px solid #395ce6",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "100px",
            cursor: "pointer",
          }}
        >
          Save Changes
        </div>
      </div>
      <div className="dndflow" style={{ height: "100vh", width: "100%" }}>
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onEdgeUpdate={onEdgeUpdate}
              onEdgeUpdateStart={onEdgeUpdateStart}
              onEdgeUpdateEnd={onEdgeUpdateEnd}
              nodeTypes={nodeTypes}
              defaultViewport={{ x: 250, y: 250, zoom: 0.75 }}
              onNodeClick={onNodeClick}
              // onClick={()=>{setSelectedNode(null)}}
            >
              <Controls style={{ marginBottom: "60px" }} />
              <Background />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
        <Sidebar selectedNode={selectedNode} handleLabel={handleUpdateLabel} />
      </div>
    </div>
  );
};

export default App;
