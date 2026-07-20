import { VideoTrack } from "@livekit/components-react";
import ParticipantInfo from "./ParticipantInfo";

export default function CustomParticipantTile({ trackRef }) {
  const participant = trackRef.participant;
  const isSpeaking = participant.isSpeaking;

  function getAvatarColor(name) {
    const colors = [
      "#4285F4",
      "#34A853",
      "#FBBC05",
      "#EA4335",
      "#9C27B0",
      "#00ACC1",
      "#FF7043",
      "#5C6BC0",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }

    return colors[hash % colors.length];
  }

  return (
    <div
  style={{
    width: "100%",
    height: "100%",
    background: "#000",
    borderRadius: "16px",
    overflow: "hidden",
    position: "relative",
    border: isSpeaking ? "4px solid #34A853" : "2px solid #3c4043",
    transition: "border .2s",
  }}
>
      {trackRef.publication ? (
        <VideoTrack
          trackRef={trackRef}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#2d2d2d",
          }}
        >
          <div
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              background: getAvatarColor(participant.identity),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "48px",
              fontWeight: "bold",
            }}
          >
            {participant.identity.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
        }}
      >
        <ParticipantInfo participant={participant} />
      </div>
    </div>
  );
}