import { memo } from "react";
import { Handle, Position } from "reactflow";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ChatIcon from "@mui/icons-material/Chat";

const CustomNode = ({ isConnectable, data }) => {
 

  const nodeStyle = {
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
    fontFamily: "Arial, sans-serif",
    width: "300px",
  };

  const headerStyle = {
    background: "#8aeca7",
    padding: "10px",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
  };

  const bodyStyle = {
    padding: "15px",
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
  };

  const iconContainerStyle = {
    display: "flex",
    alignItems: "center",
  };

  const iconStyle = {
    marginRight: "5px",
  };

  return (
    <div style={nodeStyle}>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "#555",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        isConnectable={isConnectable}
      />
      <div style={headerStyle}>
        <div style={iconContainerStyle}>
          <ChatIcon style={iconStyle} />
          <span style={{ fontWeight: "bold" }}> Send Message</span>
        </div>
        <div
          style={{
            background: "white",
            padding: "3px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
          }}
        >
          <WhatsAppIcon />
        </div>
      </div>
      <div style={bodyStyle}>
        <span>{data.label}</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{
          background: "#555",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(CustomNode);
