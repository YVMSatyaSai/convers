import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

export default function ParticipantInfo({ participant }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "white",
        background: "rgba(0,0,0,0.6)",
        padding: "6px 12px",
        borderRadius: "20px",
      }}
    >
      <span>{participant.identity}</span>

      {participant.isMicrophoneEnabled ? (
        <FaMicrophone />
      ) : (
        <FaMicrophoneSlash color="red" />
      )}

      {participant.isCameraEnabled ? (
        <FaVideo />
      ) : (
        <FaVideoSlash color="red" />
      )}
    </div>
  );
}