import ParticipantGrid from "../components/meeting/ParticipantGrid";
import BottomToolbar from "../components/meeting/BottomToolbar";
import { useEffect, useState } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { useParams, useSearchParams } from "react-router-dom";
import "@livekit/components-styles";
import {getMeetingToken,getServerUrl,} from "../services/meetingService";


export default function MeetingRoom() {
    const { meetingId } = useParams();
    const [searchParams] = useSearchParams();

const participantName =
  searchParams.get("name") || "Guest";

  const [token, setToken] = useState("");

  useEffect(() => {
    async function loadToken() {
      const jwt = await getMeetingToken(
  meetingId,
  participantName
);

setToken(jwt);
    }

    loadToken();
  }, [meetingId]);

  if (!token) {
    return <h2>Loading...</h2>;
  }

return (
  <LiveKitRoom
    token={token}
    serverUrl={getServerUrl()}
    connect={true}
    video={true}
    audio={true}
    
  >
   

    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#202124",
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "60px",
            background: "#202124",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            borderBottom: "1px solid #3c4043",
          }}
        >
          <h3 style={{ margin: 0 }}>Convers</h3>

          <div>
            Meeting ID : <b>{meetingId}</b>
          </div>
        </div>

        <ParticipantGrid />
      </div>

      <BottomToolbar />
    </div>
  </LiveKitRoom>
);
}