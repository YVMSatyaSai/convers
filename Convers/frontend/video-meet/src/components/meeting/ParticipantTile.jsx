import { useParticipant } from "@livekit/components-react";

export default function ParticipantTile({ participant }) {
  const {
    cameraPublication,
    microphonePublication,
    isSpeaking,
  } = useParticipant(participant);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        background: "#2d2d2d",
        position: "relative",
      }}
    >
      <video
        ref={(video) => {
          if (
            video &&
            cameraPublication?.track
          ) {
            cameraPublication.track.attach(video);
          }
        }}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          color: "white",
          fontWeight: "bold",
          background: "rgba(0,0,0,.5)",
          padding: "4px 10px",
          borderRadius: "20px",
        }}
      >
        {participant.identity}
      </div>
    </div>
  );
}