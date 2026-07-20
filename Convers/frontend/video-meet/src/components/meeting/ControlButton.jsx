export default function ControlButton({
  icon,
  onClick,
  active = true,
  danger = false,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "0.2s",

        background: danger
          ? "#ea4335"
          : active
          ? "#3c4043"
          : "#d93025",

        color: "white",
      }}
    >
      {icon}
    </button>
  );
}