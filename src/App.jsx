import { useState, useRef, useCallback, useEffect } from "react";
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
import { Alert, Snackbar } from "@mui/material";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const checkIsolatedNodes = () => {
    for (const node of elements.filter((el) => el.type === 'selectorNode')) {
      if (!elements.some((el) => el.source === node.id || el.target === node.id)) {
        setSnackbarOpen(true);
        return;
      }
    }
    setSnackbarOpen(false);
  };
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
        data: { value: `test message ${id}` },
      };

      setNodes((nds) => {
        const updatedNodes = nds.concat(newNode);
        setSelectedNode(newNode); // Set the new node as the selected node
        return updatedNodes;
      });
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
    setNodes((prevNodes) => {
      const updatedNodes = [...prevNodes];
      const targetIndex = updatedNodes.findIndex((node) => node.id === id);

      if (targetIndex !== -1) {
        updatedNodes[targetIndex] = {
          ...updatedNodes[targetIndex],
          data: { label: newLabel },
        };
      }

      return updatedNodes;
    });
  };

  const handleClick = (newState) => () => {
   
    setState({ ...newState, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  // const hasNodeWithoutEdges = nodes.some(
  //   (node) =>
  //     !edges.some((edge) => edge.source === node.id || edge.target === node.id)
  // );

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
          onClick={() =>snackbarOpen && handleClick({ vertical: "top", horizontal: "center" })}

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
        <Sidebar
          selectedNode={selectedNode}
          handleLabel={handleUpdateLabel}
          setSelectedNode={setSelectedNode}
        />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%", color: "black", background: "#ea8b8b" }}
        >
          Cannot Save Flow
        </Alert>
      </Snackbar>
    </div>
  );
};

export default App;
