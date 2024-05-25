import ChatIcon from "@mui/icons-material/Chat";
const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div style={{display:'flex',paddingTop:"20px",paddingRight:"90px",borderLeft:"1px solid #d2caca"}}>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, "input")}
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
          marginLeft: "60px",
          display:'flex',
          flexDirection:'column',
         
        }}
      >
        <ChatIcon/>
        <span>
          Message
        </span>
      </div>
    </div>
  );
};
export default Sidebar;
