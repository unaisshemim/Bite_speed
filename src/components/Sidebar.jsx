import ChatIcon from "@mui/icons-material/Chat";
import WhatsAppNode from "./WhatsAppNode";
import { FormControl, FormLabel, IconButton } from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const Sidebar = ({ selectedNode, handleLabel, setSelectedNode }) => {


  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleChange = (e) => {
    const label = e.target.value;
    handleLabel(selectedNode.id, label);
  };
  return (
    <div
      style={{
        display: "flex",
        paddingRight: "120px",
        borderLeft: "1px solid #d2caca",
      }}
    >
     

      {selectedNode ? (
        <div>
          <div
            style={{ display: "flex", alignItems: "center", marginLeft: "5px" }}
          >
            <IconButton
              onClick={() => {
                setSelectedNode(null); // Set selectedNode to null when clicking back arrow
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <h3 style={{ fontFamily: "sans-serif", marginLeft: "50%" }}>
              Message
            </h3>
          </div>
          <div style={{ paddingLeft: "20px" }}>
            <FormControl>
              <FormLabel>Text</FormLabel>
              <Textarea
                name="Outlined"
                placeholder="Type in here…"
                variant="outlined"
                onChange={handleChange}
                value={selectedNode.data.label}
              />
            </FormControl>
          </div>
        </div>
      ) : (
        <div
          className="dndnode input"
          onDragStart={(event) => onDragStart(event, WhatsAppNode)}
          draggable
          style={{
            border: "2px solid #395ce6",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            height: "10px",
            width: "100px",
            padding: "30px",
            marginLeft: "50px",
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
          }}
        >
          <ChatIcon />
          <span>Message</span>
        </div>
      )}
    </div>
  );
};
export default Sidebar;
